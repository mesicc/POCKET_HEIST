"use client";

import { Clock8, LogOut, Plus } from "lucide-react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useUser } from "@/lib/auth";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user } = useUser();

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <div className={styles.siteNav}>
      <nav>
        <header>
          <h1>
            <Link href="/heists">
              P<Clock8 className={styles.logo} size={14} strokeWidth={2.75} />
              cket Heist
            </Link>
          </h1>
          <div>Tiny missions. Big office mischief.</div>
        </header>
        <ul>
          {user && (
            <li>
              <button
                type="button"
                onClick={handleLogout}
                className={styles.createHeistBtn}
              >
                <LogOut size={16} strokeWidth={2.75} />
                Logout
              </button>
            </li>
          )}
          <li>
            <Link href="/heists/create" className={styles.createHeistBtn}>
              <Plus size={16} strokeWidth={2.75} />
              Create Heist
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
