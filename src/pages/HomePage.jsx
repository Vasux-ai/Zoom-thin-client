import { useCallback, useEffect, useState } from 'react'
import { Layout } from '../components/Layout/Layout'
import { JoinForm } from '../components/JoinForm/JoinForm'
import { useZoomJoin, ZOOM_ROOT_ID } from '../hooks/useZoomJoin'
import { getLangFromUrl } from '../i18n/translations'
import styles from './HomePage.module.css'

const ZOOM_LOCALE_MAP = {
  en: '/locales/en.json',
  hi: '/locales/hi.json',
  mr: '/locales/mr.json',
}

// Check if URL has meeting parameters
function hasMeetingParams() {
  if (typeof window === 'undefined') return false
  const params = new URLSearchParams(window.location.search)
  return params.has('join') || params.has('meetingNumber') || params.has('meeting') || params.has('mn')
}

export function HomePage() {
  const appLang = getLangFromUrl()
  const localeUrl = ZOOM_LOCALE_MAP[appLang] || ZOOM_LOCALE_MAP.en
  const { join, loading, error, joined } = useZoomJoin({ localeUrl })
  const [returnedFromMeeting, setReturnedFromMeeting] = useState(false)

  // Check if user is returning from a meeting
  useEffect(() => {
    if (typeof sessionStorage !== 'undefined') {
      const wasInMeeting = sessionStorage.getItem('zoom_meeting_joined') === 'true'
      const hasParams = hasMeetingParams()

      // If user was in a meeting and there are no meeting params, they're returning
      if (wasInMeeting && !hasParams) {
        setReturnedFromMeeting(true)
        // Clear the flag so it doesn't persist
        sessionStorage.removeItem('zoom_meeting_joined')
      } else if (hasParams) {
        // If there are meeting params, clear the flag (user is starting a new join)
        sessionStorage.removeItem('zoom_meeting_joined')
        setReturnedFromMeeting(false)
      }
    }
  }, [])

  const handleJoin = useCallback(
    (params) => {
      join(params).catch(() => { })
    },
    [join]
  )

  // Hide form if user returned from meeting or is currently in a meeting
  const showForm = !joined && !returnedFromMeeting

  return (
    <>
      {showForm && (
        <Layout>
          <JoinForm onJoin={handleJoin} loading={loading} error={error} />
        </Layout>
      )}
      <div id={ZOOM_ROOT_ID} className={styles.zoomRoot} aria-hidden={!joined} />
    </>
  )
}
