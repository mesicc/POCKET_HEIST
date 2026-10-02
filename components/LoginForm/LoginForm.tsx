"use client";

import { useState } from "react";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Button from "@/components/Button";
import Input from "@/components/Input";
import PasswordInput from "@/components/PasswordInput";
import styles from "./LoginForm.module.css";

function getErrorMessage(error: unknown): string {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code: unknown }).code)
      : undefined;

  switch (code) {
    case "auth/invalid-credential":
      return "Invalid email or password. Please try again.";
    case "auth/user-not-found":
      return "No account found with this email address.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/too-many-requests":
      return "Too many failed login attempts. Please try again later.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    default:
      return "An error occurred during login. Please try again.";
  }
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!e.currentTarget.checkValidity()) {
      console.log("Enter a valid email address and password to log in");
      return;
    }

    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess(true);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {success && <div className={styles.success}>Login successful</div>}
      {error && <div className={styles.error}>{error}</div>}
      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        required
        disabled={loading}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <PasswordInput
        id="password"
        name="password"
        label="Password"
        placeholder="Enter your password"
        required
        disabled={loading}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Logging In..." : "Log In"}
      </Button>
      <p className={styles.prompt}>
        Don&apos;t have an account? <Link href="/signup">Sign up</Link>
      </p>
    </form>
  );
}
