import styles from "./ExpiredHeistCardSkeleton.module.css";

export default function ExpiredHeistCardSkeleton() {
  return (
    <div className={styles.card} role="status" aria-label="Loading">
      <div className={styles.main}>
        <div className={styles.circle} />
        <div className={styles.details}>
          <div className={`${styles.line} w-48`} />
          <div className={`${styles.line} w-32`} />
        </div>
      </div>
      <div className={styles.meta}>
        <div className={`${styles.line} w-28`} />
        <div className={styles.badge} />
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
