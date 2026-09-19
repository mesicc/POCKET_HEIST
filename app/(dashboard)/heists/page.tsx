export default function HeistsPage() {
  return (
    <div className="page-content">
      <div className="heists-intro">
        <h2>Welcome back, Agent</h2>
        <p>
          The coffee machine is unattended and the supply cupboard is
          unguarded. Everything currently on your plate is below &mdash; the
          missions you&rsquo;ve accepted, the mischief you&rsquo;ve delegated,
          and the jobs that slipped away.
        </p>
        <p>Placeholder copy &mdash; replace once heist data is wired up.</p>
      </div>
      <div className="active-heists">
        <h2>Your Active Heists</h2>
      </div>
      <div className="assigned-heists">
        <h2>Heists You&rsquo;ve Assigned</h2>
      </div>
      <div className="expired-heists">
        <h2>All Expired Heists</h2>
      </div>
    </div>
  )
}
