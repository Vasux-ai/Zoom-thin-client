import { useCallback } from 'react'
import { Layout } from '../components/Layout/Layout'
import { JoinForm } from '../components/JoinForm/JoinForm'
import { useZoomJoin, ZOOM_ROOT_ID } from '../hooks/useZoomJoin'
import { getLangFromUrl } from '../i18n/translations'
import styles from './HomePage.module.css'

const ZOOM_LOCALE_MAP = {
  en: 'en-US',
  hi: 'en-US',
  mr: 'en-US',
}

export function HomePage() {
  const appLang = getLangFromUrl()
  const zoomLocale = ZOOM_LOCALE_MAP[appLang] || 'en-US'
  const { join, loading, error, joined } = useZoomJoin({ localeUrl: zoomLocale })

  const handleJoin = useCallback(
    (params) => {
      join(params).catch(() => {})
    },
    [join]
  )

  return (
    <>
      {!joined && (
        <Layout>
          <JoinForm onJoin={handleJoin} loading={loading} error={error} />
        </Layout>
      )}
      <div id={ZOOM_ROOT_ID} className={styles.zoomRoot} aria-hidden={!joined} />
    </>
  )
}
