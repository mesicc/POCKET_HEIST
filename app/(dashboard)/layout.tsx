"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";

// components
import Navbar from "@/components/Navbar";
import LoadingSpinner from "@/components/LoadingSpinner";

// auth
import { useUser } from "@/lib/auth";

export default function HeistsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && !user) {
      redirect("/login");
    }
  }, [user, loading]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
