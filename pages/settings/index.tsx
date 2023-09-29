import EditUserData from '@/components/EditUserData';
import { refreshIfNewAppVersionAvailable } from '@/utils/appversionutil';
import { LocalStorageKey } from '@/utils/constants';
import { Box } from '@chakra-ui/react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useLocalStorage from 'use-local-storage';

export default function SettingsPage () {
  const session = useSession()
  const supabase = useSupabaseClient()
  const router = useRouter()
  const [appVersion, setAppVersion] = useLocalStorage<string>(LocalStorageKey.appVersion, "")

  useEffect(() => {
    refreshIfNewAppVersionAvailable(appVersion, setAppVersion, router)
  })

  return (
    <div>
      {!session ? (
        <Box p={4}>
          <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} theme="light" providers={[]} />
        </Box>
      ) : (
        <EditUserData />
      )}
    </div>
  )
}
