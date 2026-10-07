import Link from "next/link";
import { Calendar, Check, User, X } from "lucide-react";
import type { Heist } from "@/types/firestore";
import styles from "./ExpiredHeistCard.module.css";

interface ExpiredHeistCardProps {
  heist: Heist;
}

function formatTimestamp(date: Date | undefined): string {
  if (!date || Number.isNaN(date.getTime())) return "Unknown";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ExpiredHeistCard({ heist }: ExpiredHeistCardProps) {
  const isSuccess = heist.finalStatus === "success";
  const StatusIcon = isSuccess ? Check : X;
  const statusClass = isSuccess ? styles.success : styles.failed;

  return (
    <article className={styles.card}>
      <div className={styles.main}>
        <span className={`${styles.statusCircle} ${statusClass}`}>
          <StatusIcon size={20} aria-hidden="true" />
        </span>
        <div className={styles.details}>
          <h3>
            <Link href={`/heists/${heist.id}`} className={styles.title}>
              {heist.title}
            </Link>
          </h3>
          <p className={styles.assignee}>
            <User size={16} aria-hidden="true" />
            <span>To:</span>
            <span className={styles.codename}>{heist.assignedToCodename}</span>
          </p>
        </div>
      </div>

      <div className={styles.meta}>
        <p className={styles.timestamp}>
          <Calendar size={16} aria-hidden="true" />
          <span>{formatTimestamp(heist.deadline)}</span>
        </p>
        <span className={`${styles.badge} ${statusClass}`}>
          {isSuccess ? "SUCCESS" : "FAILED"}
        </span>
      </div>
    </article>
  );
}
