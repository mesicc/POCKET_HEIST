"use client";

import { useHeists } from "@/lib/hooks";
import type { UseHeistsReturn } from "@/lib/hooks";
import HeistCard, { HeistCardSkeleton } from "@/components/HeistCard";
import ExpiredHeistCard, {
  ExpiredHeistCardSkeleton,
} from "@/components/ExpiredHeistCard";
import styles from "./page.module.css";

function ExpiredHeistCards({
  heists,
  loading,
  error,
  emptyMessage,
}: UseHeistsReturn & { emptyMessage: string }) {
  if (loading) {
    return (
      <div className={styles.list}>
        {Array.from({ length: 3 }, (_, i) => (
          <ExpiredHeistCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (error) return <p className={styles.errorMessage}>{error}</p>;
  if (heists.length === 0) {
    return <p className={styles.emptyState}>{emptyMessage}</p>;
  }

  return (
    <div className={styles.list}>
      {heists.map((heist) => (
        <ExpiredHeistCard key={heist.id} heist={heist} />
      ))}
    </div>
  );
}

function HeistCards({
  heists,
  loading,
  error,
  emptyMessage,
}: UseHeistsReturn & { emptyMessage: string }) {
  if (loading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 3 }, (_, i) => (
          <HeistCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (error) return <p className={styles.errorMessage}>{error}</p>;
  if (heists.length === 0) {
    return <p className={styles.emptyState}>{emptyMessage}</p>;
  }

  return (
    <div className={styles.grid}>
      {heists.map((heist) => (
        <HeistCard key={heist.id} heist={heist} />
      ))}
    </div>
  );
}

export default function HeistsPage() {
  const active = useHeists("active");
  const assigned = useHeists("assigned");
  const expired = useHeists("expired");

  return (
    <div className="page-content">
      <div className="heists-intro">
        <h2>Welcome back, Agent</h2>
        <p>
          The coffee machine is unattended and the supply cupboard is unguarded.
          Everything currently on your plate is below &mdash; the missions
          you&rsquo;ve accepted, the mischief you&rsquo;ve delegated, and the
          jobs that slipped away.
        </p>
        <p>Placeholder copy &mdash; replace once heist data is wired up.</p>
      </div>
      <div className="active-heists">
        <h2>Your Active Heists</h2>
        <HeistCards {...active} emptyMessage="No active heists" />
      </div>
      <div className="assigned-heists">
        <h2>Heists You&rsquo;ve Assigned</h2>
        <HeistCards {...assigned} emptyMessage="No assigned heists" />
      </div>
      <div className="expired-heists">
        <h2>All Expired Heists</h2>
        <ExpiredHeistCards {...expired} emptyMessage="No expired heists" />
      </div>
    </div>
  );
}
