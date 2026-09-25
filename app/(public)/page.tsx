// this page should be used only as a splash page to decide where a user should be navigated to
// when logged in --> to /heists
// when not logged in --> to /login

import { Clock8 } from "lucide-react"

export default function Home() {
  return (
    <div className="center-content">
      <div className="page-content">
        <h1>
          P<Clock8 className="logo" strokeWidth={2.75} />cket Heist
        </h1>
        <div>Steal the stapler. Become a legend.</div>
        <div className="splash-intro">
          <p>
            The office is quiet, the stapler is unguarded, and somebody left
            the good biscuits out. Hand your colleagues a tiny mission, set a
            timer, and see who actually pulls it off.
          </p>
          <p>Placeholder copy &mdash; replace once the splash redirect lands.</p>
        </div>
      </div>
    </div>
  )
}
