import { Database } from '@/utils/database'
import { getCurrentLocalISOTimeString, getLocaleStringForUI } from '@/utils/datetime'
import { handleErrorInFrontend } from '@/utils/error'
import { stlPhotoCommentDetail, stlPhotoDetail } from '@/utils/type'
import {
  Box,
  Button,
  FormControl,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  StackDivider,
  Text,
  VStack
} from '@chakra-ui/react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { v4 } from 'uuid'

export default function PhotoDetailPage({ viewedPhotoId }: { viewedPhotoId: string }) {
  const supabase = useSupabaseClient<Database>()
  const user = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [photoDetail, setPhotoDetail] = useState<stlPhotoDetail | undefined>(undefined)
  const [commentList, setCommentList] = useState<stlPhotoCommentDetail[]>([])
  const [commenterIdToNameMap, setCommenterIdToNameMap] = useState<any>({})
  const [comment, setComment] = useState("")

  async function loadPhotoDetail() {
    try {
      setLoading(true)
      if (!user) { alert('No user'); return }

      const getPhotoDetailResp = await supabase
      .from('stlPhotoDetail')
      .select("*")
      .eq("hubPhotoId", viewedPhotoId)
      if (getPhotoDetailResp.error && getPhotoDetailResp.status !== 406) {
        throw getPhotoDetailResp.error
      }
      if (getPhotoDetailResp.data === null || getPhotoDetailResp.data.length === 0) {
        return
      }
      setPhotoDetail(getPhotoDetailResp.data[0])
    } catch (error) {
      handleErrorInFrontend(error)
    } finally {
      setLoading(false)
    }
  }

  async function loadCommentList() {
    try {
      setLoading(true)
      if (!user) { alert('No user'); return }

      const getCommentDetailListResp = await supabase
      .from('stlPhotoCommentDetail')
      .select("*")
      .eq("hubPhotoId", viewedPhotoId)
      .order("timeCreated", { ascending: false })
      .limit(100) //TODO: pagination
      if (getCommentDetailListResp.error && getCommentDetailListResp.status !== 406) {
        throw getCommentDetailListResp.error
      }
      if (getCommentDetailListResp.data === null || getCommentDetailListResp.data.length === 0) {
        return
      }
      const userIdList = getCommentDetailListResp.data.map(comment => comment.userId)
      
      const getCommenterListResp = await supabase
      .from('stlUserDetail')
      .select("*")
      .in("userId", userIdList)
      .limit(100) //TODO: pagination
      if (getCommenterListResp.error && getCommenterListResp.status !== 406) {
        throw getCommenterListResp.error
      }
      if (getCommenterListResp.data === null || getCommenterListResp.data.length === 0) {
        return
      }
      const commenterMap = commenterIdToNameMap
      for (let i = 0; i < getCommenterListResp.data.length; i++) {
        const user = getCommenterListResp.data[i];
        commenterMap[user.userId] = user.userName
      }

      setCommentList(getCommentDetailListResp.data)
      setCommenterIdToNameMap(commenterMap)
    } catch (error) {
      handleErrorInFrontend(error)
    } finally {
      setLoading(false)
    }
  }

  async function addComment() {
    try {
      setLoading(true)
      if (!user) { alert('No user'); return }
      if (!comment) { alert('Please input your comment'); return }

      const now = getCurrentLocalISOTimeString()
      const commentDetail: stlPhotoCommentDetail = {
        content: comment,
        hubPhotoCommentId: v4(),
        hubPhotoId: viewedPhotoId,
        timeCreated: now,
        timeUpdated: null,
        userId: user.id,
      }
      
      const insertPhotoCommentDetailResp = await supabase
        .from('stlPhotoCommentDetail')
        .insert(commentDetail)
      if (insertPhotoCommentDetailResp.error && insertPhotoCommentDetailResp.status !== 406) {
        throw insertPhotoCommentDetailResp.error
      }
      alert("Comment added")
      setCommentList([commentDetail, ...commentList])
      setComment('')

      if(!commenterIdToNameMap[user.id]){
        const getUserDetailResp = await supabase
        .from('stlUserDetail')
        .select("*")
        .eq("userId", user.id)
        if (getUserDetailResp.error && getUserDetailResp.status !== 406) {
          throw getUserDetailResp.error
        }
        if (getUserDetailResp.data === null || getUserDetailResp.data.length === 0) {
          return
        }
        const commenterMap = commenterIdToNameMap
        commenterMap[user.id] = getUserDetailResp.data[0].userName
        setCommenterIdToNameMap(commenterMap)
      }
    } catch (error) {
      handleErrorInFrontend(error)
    } finally {
      setLoading(false)
    }
  }

  async function initialPageLoad(){
    loadPhotoDetail()
    loadCommentList()
  }

  useEffect(() => {
    if (user){
      initialPageLoad()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [true])

  const gridColumns = {base:1}
  return (
    <Box p={4}>
      <Stack direction="column" align="center">
        <Button
          colorScheme='black'
          variant='outline'
          onClick={() => {
            router.back()
          }}
        >
          Back
        </Button>
        {
          photoDetail !== undefined ?
          <>
            <Image maxHeight="400px" src={photoDetail.photoUrl} alt='user uploaded photo' borderRadius='lg' />
            <Text>Uploaded: {getLocaleStringForUI(photoDetail.timeCreated)}</Text>
          </>
          :
          <></>
        }
        <FormControl mt={4}>
          <InputGroup size='md'>
            <Input
              type="text"
              placeholder="Add your comment here..."
              value={comment}
              onChange={(event) =>
                setComment(event.target.value)
              }
              onKeyUp={(event) => {
                if (event.key === 'Enter') {
                  addComment()
                }
              }}
            />
            <InputRightElement>
              <Button
                isLoading={loading}
                onClick={addComment}
              >
                Send
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <VStack
          divider={<StackDivider borderColor='gray.200' />}
          align="left" w='full' spacing={2} mt={4}
        >
          {commentList.length === 0 ? (
            <Text align="center">No comments yet</Text>
          ) : (
            commentList.map((comment) => {
              return (
                <div key={comment.hubPhotoCommentId}>
                  <Text align="left" fontWeight="bold">{commenterIdToNameMap[comment.userId]}:</Text>
                  <Text align="left">{comment.content}</Text>
                  <Text align="left" color='gray.500' fontSize='xs'>{getLocaleStringForUI(comment.timeCreated)}</Text>
                </div>
              )
            })
          )}
        </VStack>
      </Stack>
    </Box>
  )
}
