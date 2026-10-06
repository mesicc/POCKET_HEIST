"use client";

import { useHeists } from "@/lib/hooks";
import type { UseHeistsReturn } from "@/lib/hooks";

function HeistTitles({
  heists,
  loading,
  error,
  emptyMessage,
}: UseHeistsReturn & { emptyMessage: string }) {
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (heists.length === 0) return <p>{emptyMessage}</p>;

  return (
    <ul>
      {heists.map((heist) => (
        <li key={heist.id}>{heist.title}</li>
      ))}
    </ul>
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
        <HeistTitles {...active} emptyMessage="No active heists" />
      </div>
      <div className="assigned-heists">
        <h2>Heists You&rsquo;ve Assigned</h2>
        <HeistTitles {...assigned} emptyMessage="No assigned heists" />
      </div>
      <div className="expired-heists">
        <h2>All Expired Heists</h2>
        <HeistTitles {...expired} emptyMessage="No expired heists" />
      </div>
    </div>
  );
}
