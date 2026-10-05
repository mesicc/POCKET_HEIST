import Link from "next/link";
import { Clock8 } from "lucide-react";

import styles from "./page.module.css";

const steps = [
  {
    title: "Set a mission",
    text: "Pick a small, harmless job for a coworker. Swap the stapler. Hide the good biscuits.",
  },
  {
    title: "Start the clock",
    text: "Every heist has a deadline. The countdown starts as soon as the mission is accepted.",
  },
  {
    title: "Claim the glory",
    text: "Finish before time runs out and the legend status is yours.",
  },
];

export default function Home() {
  return (
    <div className="center-content">
      <div className="page-content">
        <div className={styles.splash}>
          <div className={styles.wordmark}>
            P<Clock8 className="logo" strokeWidth={2.75} />
            cket Heist
          </div>

          <section className={styles.hero}>
            <div>
              <h1 className={styles.title}>
                Tiny missions.
                <span>Legendary status.</span>
              </h1>
              <p className={styles.lead}>
                Give your coworkers a small, harmless mission and a deadline.
                Pull it off before the clock runs out and you&apos;re an office
                legend.
              </p>
              <div className={styles.actions}>
                <Link href="/signup" className={`btn ${styles.register}`}>
                  Register
                </Link>
                <Link href="/login" className={styles.login}>
                  I already have an account
                </Link>
              </div>
            </div>

            <aside className={styles.brief} aria-label="Example mission">
              <div className={styles.briefTop}>
                <div className={styles.countdown}>00:14:32</div>
                <div className={styles.clock} aria-hidden="true" />
              </div>
              <h2 className={styles.briefTitle}>
                Swap the stapler for a rubber duck
              </h2>
              <p className={styles.briefText}>
                Nobody can see you do it. Nobody can know it was you. Leave the
                duck facing the monitor.
              </p>
              <div className={styles.briefMeta}>
                <span>Target: Dave, Accounts</span>
                <span className={styles.status}>In progress</span>
              </div>
            </aside>
          </section>

          <section className={styles.steps} aria-label="How it works">
            {steps.map((step, index) => (
              <div key={step.title} className={styles.step}>
                <div className={styles.stepNumber}>{index + 1}</div>
                <h2 className={styles.stepTitle}>{step.title}</h2>
                <p className={styles.stepText}>{step.text}</p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
