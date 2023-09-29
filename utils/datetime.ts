import { formatInTimeZone } from 'date-fns-tz';

const PostgreSQLDateTimeFormat = 'yyyy-MM-dd HH:mm:ss.SSSX'
export function getCurrentLocalISOTimeString(){
  const dateString = formatInTimeZone(
    new Date(),
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    PostgreSQLDateTimeFormat,
  )
  return dateString
}

export function getLocaleStringForUI(isoString: string | null | undefined): string{
  if(isoString === null || isoString === undefined){return ""}
  
  const dateString = formatInTimeZone(
    isoString,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    'yyyy-MM-dd HH:mm:ss',
  )
  return dateString
}
