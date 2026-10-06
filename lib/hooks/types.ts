import type { Heist } from "@/types/firestore";

export type HeistFilter = "active" | "assigned" | "expired";

export interface UseHeistsReturn {
  heists: Heist[];
  loading: boolean;
  error: string | null;
}
