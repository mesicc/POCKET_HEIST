"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import Input from "@/components/Input";
import PasswordInput from "@/components/PasswordInput";
import styles from "./SignupForm.module.css";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!e.currentTarget.checkValidity()) {
      console.log("Enter a valid email address and password to sign up");
      return;
    }

    console.log({ email, password });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <PasswordInput
        id="password"
        name="password"
        label="Password"
        placeholder="Choose a password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit">Sign Up</Button>
      <p className={styles.prompt}>
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </form>
  );
}
