import styles from "./Skeleton.module.css"

export default function Skeleton() {
  return (
    <div className={styles.card} role="status" aria-label="Loading">
      <div className={styles.header}>
        <div className={styles.avatar} />
        <div className={styles.headerLines}>
          <div className={`${styles.line} w-3/4`} />
          <div className={`${styles.line} w-1/2`} />
        </div>
      </div>
      <div className={styles.body}>
        <div className={`${styles.line} w-full`} />
        <div className={`${styles.line} w-full`} />
        <div className={`${styles.line} w-2/3`} />
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  )
}
