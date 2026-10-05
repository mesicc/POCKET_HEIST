import { DocumentData, FieldValue, QueryDocumentSnapshot } from "firebase/firestore";

export type HeistFinalStatus = "success" | "failure" | null;

// Document — what you read from Firestore (after conversion)
export interface Heist {
  id: string;
  title: string;
  description: string;
  createdBy: string; // uid
  createdByCodename: string;
  assignedTo: string; // uid
  assignedToCodename: string;
  createdAt: Date;
  deadline: Date; // 48 hours after creation
  finalStatus: HeistFinalStatus;
}

// Create Input — what you pass to addDoc
export interface CreateHeistInput {
  title: string;
  description: string;
  createdBy: string;
  createdByCodename: string;
  assignedTo: string;
  assignedToCodename: string;
  createdAt: FieldValue; // serverTimestamp()
  deadline: Date; // now + 48 hours
  finalStatus: null;
}

// Update Input — partial fields for updateDoc (no createdAt)
export interface UpdateHeistInput {
  title?: string;
  description?: string;
  createdBy?: string;
  createdByCodename?: string;
  assignedTo?: string;
  assignedToCodename?: string;
  deadline?: Date;
  finalStatus?: HeistFinalStatus;
}

export const heistConverter = {
  toFirestore: (data: Partial<Heist>): DocumentData => data,

  fromFirestore: (snapshot: QueryDocumentSnapshot): Heist => ({
    id: snapshot.id,
    ...snapshot.data(),
    createdAt: snapshot.data().createdAt?.toDate(),
    deadline: snapshot.data().deadline?.toDate(),
  } as Heist),
};
