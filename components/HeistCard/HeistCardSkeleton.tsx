import styles from "./HeistCardSkeleton.module.css";

export default function HeistCardSkeleton() {
  return (
    <div className={styles.card} role="status" aria-label="Loading">
      <div className={`${styles.line} w-3/4`} />
      <div className={`${styles.line} w-1/2`} />
      <div className={`${styles.line} w-3/5`} />
      <div className={`${styles.line} w-2/5`} />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
