"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";

// components
import LoadingSpinner from "@/components/LoadingSpinner";

// auth
import { useUser } from "@/lib/auth";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && user) {
      redirect("/heists");
    }
  }, [user, loading]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return null;
  }

  return <main className="public">{children}</main>;
}
