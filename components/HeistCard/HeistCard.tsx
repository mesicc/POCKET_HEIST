import Link from "next/link";
import { Calendar, Clock, User, Users } from "lucide-react";
import type { Heist } from "@/types/firestore";
import styles from "./HeistCard.module.css";

interface HeistCardProps {
  heist: Heist;
}

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function pluralise(count: number, unit: string) {
  return `${count} ${unit}${count === 1 ? "" : "s"} left`;
}

function formatDeadline(deadline: Date): { text: string; isOverdue: boolean } {
  const remaining = deadline.getTime() - Date.now();

  if (remaining <= 0) return { text: "Overdue", isOverdue: true };
  if (remaining >= DAY) {
    return {
      text: pluralise(Math.floor(remaining / DAY), "day"),
      isOverdue: false,
    };
  }
  if (remaining >= HOUR) {
    return {
      text: pluralise(Math.floor(remaining / HOUR), "hour"),
      isOverdue: false,
    };
  }
  return {
    text: pluralise(Math.max(1, Math.floor(remaining / MINUTE)), "minute"),
    isOverdue: false,
  };
}

function formatTimestamp(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HeistCard({ heist }: HeistCardProps) {
  const { text, isOverdue } = formatDeadline(heist.deadline);

  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <h3>
          <Link href={`/heists/${heist.id}`} className={styles.title}>
            {heist.title}
          </Link>
        </h3>
        <Clock size={20} className={styles.clockIcon} aria-hidden="true" />
      </div>

      <p className={styles.row}>
        <User size={16} aria-hidden="true" />
        <span>To:</span>
        <span className={styles.usernamePrimary}>
          {heist.assignedToCodename}
        </span>
      </p>
      <p className={styles.row}>
        <Users size={16} aria-hidden="true" />
        <span>By:</span>
        <span className={styles.usernameSecondary}>
          {heist.createdByCodename}
        </span>
      </p>
      <p className={styles.row}>
        <Calendar size={16} aria-hidden="true" />
        <span>{formatTimestamp(heist.deadline)}</span>
        <span>•</span>
        <span
          className={isOverdue ? styles.deadlineOverdue : styles.deadlineNormal}
        >
          {text}
        </span>
      </p>
    </article>
  );
}
