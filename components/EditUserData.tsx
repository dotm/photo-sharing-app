import { createEmptyUserDetail } from '@/utils/emptyModels';
import { handleErrorInFrontend } from '@/utils/error';
import { stlUserDetail } from '@/utils/type';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text
} from '@chakra-ui/react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Database } from '../utils/database';

export default function EditUserData() {
  const supabase = useSupabaseClient<Database>()
  const user = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [userDetail, setUserDetail] = useState<stlUserDetail>(createEmptyUserDetail(user?.id ?? "N/A"))

  async function saveUserDetail() {
    try {
      setLoading(true)
      if (!user) { alert('No user'); return }
      if (!userDetail) { alert('No user detail'); return }
      if (!userDetail.userName) { alert('Please input your username'); return }

      const upsertUserDetailResp = await supabase
      .from('stlUserDetail')
      .upsert(userDetail)
      .eq("userId", userDetail.userId)
      if (upsertUserDetailResp.error) {
        throw upsertUserDetailResp.error
      }

      alert("Changes has been saved!")
      router.push('/')
    } catch (error) {
      handleErrorInFrontend(error)
    } finally {
      setLoading(false)
    }
  }
  
  async function loadUserDetail() {
    try {
      setLoading(true)
      if (!user) { alert('No user'); return }

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
      setUserDetail(getUserDetailResp.data[0])
    } catch (error) {
      handleErrorInFrontend(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user){
      loadUserDetail()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [true])

  return (
    <Box
      textAlign="left"
      shadow="md"
      my={3}
      mx="auto"
      maxW="7xl"
      py={3}
      px={3}
      bg="white"
    >
      <Box mt={4}>
        <Text
          textAlign="center"
          fontSize="sm"
          fontWeight="medium"
          color="gray.900"
        >
          Id: {userDetail?.userId ?? 'N/A'}
        </Text>
      </Box>

      <FormControl mt={4}>
        <FormLabel htmlFor="username" fontSize="sm" fontWeight="medium" color="gray.900">
          User Name{' '}
          <Text as="span" fontSize="sm" color="gray.400">
            - Must be filled
          </Text>
        </FormLabel>
        <Input
          type="text"
          size="sm"
          value={userDetail?.userName ?? ''}
          onChange={(event) =>
            setUserDetail((obj) => ({ ...obj, userName: event.target.value }))
          }
        />
      </FormControl>

      <Box
        display="flex"
        justifyContent="center"
        flexWrap="wrap"
        textAlign="center"
        mt={2}
      >
        <Button
          isLoading={loading}
          loadingText='Saving'
          colorScheme='teal'
          variant='outline'
          onClick={() => {
            saveUserDetail();
          }}
        >
          Save
        </Button>
      </Box>
    </Box>
  )
}
