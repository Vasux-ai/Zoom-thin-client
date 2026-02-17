import { useCallback } from 'react'
import { Layout } from '../components/Layout/Layout'
import { JoinForm } from '../components/JoinForm/JoinForm'
import { useZoomJoin, ZOOM_ROOT_ID } from '../hooks/useZoomJoin'
import styles from './HomePage.module.css'

const DEFAULT_LOCALE_URL = null

export function HomePage() {
  const { join, loading, error, joined } = useZoomJoin({ localeUrl: DEFAULT_LOCALE_URL })

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
