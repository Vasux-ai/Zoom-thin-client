import styles from './Layout.module.css'

export function Layout({ children }) {
  return (
    <div className={styles.layout}>
      <div className={styles.blob} aria-hidden="true" />
      <div className={styles.content}>{children}</div>
    </div>
  )
}
