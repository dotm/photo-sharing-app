import { Database } from '@/utils/database'
import { handleErrorInFrontend } from '@/utils/error'
import { stlUserDetail } from '@/utils/type'
import {
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  Link,
  SimpleGrid,
  Stack,
  Text,
  VStack
} from '@chakra-ui/react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import NextLink from 'next/link'
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
      .limit(100) //TODO: pagination
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

  const gridColumns = searchedUserList.length < 4 ? {base:1} : {base:1, sm:2, md:3, lg:4}
  return (
    <Box p={4}>
      <Stack direction="column" align="center">
        <Button
          colorScheme='black'
          variant='outline'
          onClick={() => {
            supabase.auth.signOut()
            router.push('/')
          }}
        >
          Sign Out
        </Button>
        <Button
          colorScheme='black'
          variant='outline'
          onClick={() => {
            router.push('/user/' + (user?.id ?? ""))
          }}
        >
          View My Gallery
        </Button>
        <Text fontWeight="bold">User List</Text>
        <VStack align="left" spacing={2} mt={4}>
          {searchedUserList.length === 0 ? (
            <Text align="center">No users found</Text>
          ) : (
            <SimpleGrid columns={gridColumns} spacing='10px'>
              {
                searchedUserList.map((user) => (
                  <Link key={user.userId} as={NextLink} href={`/user/${user.userId}`}>
                    <Card maxW='sm'>
                      <CardBody>
                        {/* <Image src='' alt='' borderRadius='lg' /> */}
                        <Stack spacing='3'>
                          <Heading size='md'>{user.userName}</Heading>
                        </Stack>
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
