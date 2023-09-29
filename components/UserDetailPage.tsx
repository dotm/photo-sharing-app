import { Database } from '@/utils/database'
import { getCurrentLocalISOTimeString } from '@/utils/datetime'
import { handleErrorInFrontend } from '@/utils/error'
import { stlPhotoDetail, stlUserDetail } from '@/utils/type'
import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Image,
  Input,
  Link,
  SimpleGrid,
  Stack,
  Text,
  VStack
} from '@chakra-ui/react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { v4 } from 'uuid'

export default function UserDetailPage({ viewedUserId }: { viewedUserId: string }) {
  const supabase = useSupabaseClient<Database>()
  const user = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [userDetail, setUserDetail] = useState<stlUserDetail | undefined>(undefined)
  const [photoList, setPhotoList] = useState<stlPhotoDetail[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null)
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  async function loadUserDetail() {
    try {
      setLoading(true)
      if (!user) { alert('No user'); return }

      const getUserDetailResp = await supabase
      .from('stlUserDetail')
      .select("*")
      .eq("userId", viewedUserId)
      if (getUserDetailResp.error && getUserDetailResp.status !== 406) {
        throw getUserDetailResp.error
      }
      if (getUserDetailResp.data === null || getUserDetailResp.data.length === 0) {
        return
      }
      setUserDetail(getUserDetailResp.data[0])
    } catch (error) {
      handleErrorInFrontend(error)
    } finally {
      setLoading(false)
    }
  }

  async function loadPhotoList() {
    try {
      setLoading(true)
      if (!user) { alert('No user'); return }

      const getPhotoDetailListResp = await supabase
      .from('stlPhotoDetail')
      .select("*")
      .eq("userId", viewedUserId)
      .order("timeCreated", { ascending: false })
      .limit(100) //TODO: pagination
      if (getPhotoDetailListResp.error && getPhotoDetailListResp.status !== 406) {
        throw getPhotoDetailListResp.error
      }
      if (getPhotoDetailListResp.data === null || getPhotoDetailListResp.data.length === 0) {
        return
      }
      setPhotoList(getPhotoDetailListResp.data)
    } catch (error) {
      handleErrorInFrontend(error)
    } finally {
      setLoading(false)
    }
  }

  async function uploadPhoto() {
    try {
      setLoading(true)
      if (!user) { alert('No user'); return }
      if (!selectedPhoto) { alert('No photo selected'); return }

      const photoId = v4()
      const uploadPhotoResp = await supabase.storage.from('photos').upload(`${user.id}/${photoId}`, selectedPhoto)
      if (uploadPhotoResp.error) {
        throw uploadPhotoResp.error
      }
      const getPhotoPublicUrlResp = await supabase.storage.from('photos').getPublicUrl(uploadPhotoResp.data.path)

      const now = getCurrentLocalISOTimeString()
      const photoDetail: stlPhotoDetail = {
        hubPhotoId: photoId,
        photoUrl: getPhotoPublicUrlResp.data.publicUrl,
        timeCreated: now,
        userId: user.id,
      }
      
      const insertPhotoDetailResp = await supabase
        .from('stlPhotoDetail')
        .insert(photoDetail)
      if (insertPhotoDetailResp.error && insertPhotoDetailResp.status !== 406) {
        throw insertPhotoDetailResp.error
      }

      alert("Photo successfully uploaded")
      setPhotoList([photoDetail, ...photoList])
      setSelectedPhoto(null)
      if(photoInputRef.current !== null){
        photoInputRef.current.value = ""
      }
    } catch (error) {
      handleErrorInFrontend(error)
    } finally {
      setLoading(false)
    }
  }

  async function initialPageLoad(){
    loadUserDetail()
    loadPhotoList()
  }

  useEffect(() => {
    if (user){
      initialPageLoad()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [true])

  const gridColumns = photoList.length < 4 ? {base:1} : {base:1, sm:2, md:3, lg:4}
  return (
    <Box p={4}>
      <Stack direction="column" align="center">
        {
          userDetail !== undefined ?
          <Text fontWeight="bold">{userDetail.userName}</Text>
          :
          <></>
        }
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
          viewedUserId === user?.id ?
          <VStack align="center" spacing={2} mt={4}>
            <Text>Upload a new photo</Text>
            <Input
              ref={photoInputRef}
              placeholder="Selected Photo"
              size="md"
              type="file"
              onChange={(event) => {
                setSelectedPhoto(event.target.files ? (event.target.files[0] ?? null) : null)
              }}
            />
            <Button
              isLoading={loading}
              loadingText='Uploading'
              colorScheme='teal'
              variant='outline'
              onClick={() => {
                uploadPhoto();
              }}
            >
              Upload
            </Button>
          </VStack>
          :
          <></>
        }
        <VStack align="left" spacing={2} mt={4}>
          {photoList.length === 0 ? (
            <Text>No photos found</Text>
          ) : (
            <SimpleGrid columns={gridColumns} spacing='10px'>
              {
                photoList.map((photo) => (
                  <Link key={photo.hubPhotoId} as={NextLink} href={`/photo/${photo.hubPhotoId}`}>
                    <Card maxW='sm'>
                      <CardBody>
                        <Center>
                          <Image src={photo.photoUrl} alt='user uploaded photo' borderRadius='lg' />
                        </Center>
                      </CardBody>
                    </Card>
                  </Link>
                ))
              }
            </SimpleGrid>
          )}
        </VStack>
      </Stack>
    </Box>
  )
}
