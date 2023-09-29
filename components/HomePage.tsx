import NextLink from 'next/link'

import { Database } from '@/utils/database'
import { handleErrorInFrontend } from '@/utils/error'
import { stlUserDetail } from '@/utils/type'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import {
  Box,
  ChakraProvider,
  Link,
  List,
  ListIcon,
  ListItem,
  Stack,
  Text,
  VStack
} from '@chakra-ui/react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const supabase = useSupabaseClient<Database>()
  const user = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [searchedUserList, setSearchedUserList] = useState<stlUserDetail[]>([])

  async function loadUserDetail(): Promise<stlUserDetail | undefined> {
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
        return undefined
      }
      return getUserDetailResp.data[0]
    } catch (error) {
      handleErrorInFrontend(error)
    } finally {
      setLoading(false)
    }
  }

  async function initialPageLoad(){
    let userDetail = await loadUserDetail()
    if(userDetail === undefined){
      router.push('/settings')
    }else{
      searchUser()
    }
  }

  useEffect(() => {
    if (user){
      initialPageLoad()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [true])
  
  async function searchUser() {
    try {
      setLoading(true)
      if (!user) { alert('No user'); return }

      const getUserDetailResp = await supabase
      .from('stlUserDetail')
      .select("*")
      .limit(100)
      if (getUserDetailResp.error && getUserDetailResp.status !== 406) {
        throw getUserDetailResp.error
      }
      if (getUserDetailResp.data === null || getUserDetailResp.data.length === 0) {
        setSearchedUserList([])
        return
      }
      setSearchedUserList(getUserDetailResp.data)
    } catch (error) {
      handleErrorInFrontend(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ChakraProvider>
      <Box p={4}>
        <Stack direction="column" align="center">
          {/* <Input
            type="text"
            placeholder="Search for a user"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          /> */}
          <Text fontWeight="bold">User List</Text>
          <VStack align="left" spacing={2} mt={4}>
            {searchedUserList.length === 0 ? (
              <Text>No users found</Text>
            ) : (
              <List spacing={3}>
                {
                  searchedUserList.map((user) => (
                    <ListItem key={user.userId}>
                      <Link as={NextLink} href={`/user/${user.userId}`}>
                        <ListIcon as={ArrowForwardIcon} color='green.500' />
                        {user.userName}
                      </Link>
                    </ListItem>
                  ))
                }
              </List>
            )}
          </VStack>
        </Stack>
      </Box>
    </ChakraProvider>
  )
}
