"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUser } from "@/lib/auth";
import { COLLECTIONS, heistConverter } from "@/types/firestore";
import type { Heist } from "@/types/firestore";
import type { HeistFilter, UseHeistsReturn } from "./types";

function buildQuery(filter: HeistFilter, userId: string) {
  const heistsRef = collection(db, COLLECTIONS.HEISTS).withConverter(
    heistConverter,
  );
  const now = new Date();

  switch (filter) {
    case "active":
      return query(
        heistsRef,
        where("assignedTo", "==", userId),
        where("deadline", ">", now),
      );
    case "assigned":
      return query(
        heistsRef,
        where("createdBy", "==", userId),
        where("deadline", ">", now),
      );
    case "expired":
      return query(
        heistsRef,
        where("deadline", "<", now),
        where("finalStatus", "!=", null),
        orderBy("deadline", "desc"),
      );
    default:
      throw new Error(`Invalid filter: ${filter}`);
  }
}

export function useHeists(filter: HeistFilter): UseHeistsReturn {
  const { user } = useUser();
  const uid = user?.uid;
  const [heists, setHeists] = useState<Heist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;

    const unsubscribe = onSnapshot(
      buildQuery(filter, uid),
      (snapshot) => {
        setHeists(snapshot.docs.map((doc) => doc.data() as Heist));
        setLoading(false);
      },
      (err) => {
        console.error("Heists listener error:", err);
        setHeists([]);
        setError("Failed to load heists");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [filter, uid]);

  if (!uid) return { heists: [], loading: false, error: null };

  return { heists, loading, error };
}
