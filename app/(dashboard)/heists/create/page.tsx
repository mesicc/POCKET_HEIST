"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUser } from "@/lib/auth";
import { COLLECTIONS, type CreateHeistInput } from "@/types/firestore";
import Button from "@/components/Button";
import Input from "@/components/Input";
import styles from "./page.module.css";

interface AssignableUser {
  id: string;
  codename: string;
}

const DEADLINE_HOURS = 48;

export default function CreateHeistPage() {
  const { user } = useUser();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [users, setUsers] = useState<AssignableUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    async function fetchUsers() {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const usersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          codename: doc.data().codename as string,
        }));
        setUsers(usersList.filter((u) => u.id !== user?.uid));
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to load users. Please try again.");
      } finally {
        setUsersLoading(false);
      }
    }

    fetchUsers();
  }, [user]);

  function validateForm(): boolean {
    if (!title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!description.trim()) {
      setError("Description is required");
      return false;
    }
    if (!assignedTo) {
      setError("Please select a user to assign this heist to");
      return false;
    }
    return true;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("You must be logged in to create a heist");
      return;
    }
    if (!validateForm()) return;

    const assignee = users.find((u) => u.id === assignedTo);
    if (!assignee) {
      setError("Please select a user to assign this heist to");
      return;
    }

    setLoading(true);

    try {
      const deadline = new Date();
      deadline.setHours(deadline.getHours() + DEADLINE_HOURS);

      const heistData: CreateHeistInput = {
        title: title.trim(),
        description: description.trim(),
        createdBy: user.uid,
        createdByCodename: user.displayName || "Unknown",
        assignedTo: assignee.id,
        assignedToCodename: assignee.codename,
        createdAt: serverTimestamp(),
        deadline,
        finalStatus: null,
      };

      await addDoc(collection(db, COLLECTIONS.HEISTS), heistData);

      router.push("/heists");
    } catch (err) {
      console.error("Failed to create heist:", err);
      setError("Failed to create heist. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="center-content">
      <div className="page-content">
        <h2 className="form-title">Create a New Heist</h2>
        {usersLoading && !error ? (
          <p className={styles.emptyState}>Loading...</p>
        ) : users.length === 0 ? (
          <>
            {error && <div className={styles.error}>{error}</div>}
            {!error && (
              <p className={styles.emptyState}>
                There are no other agents to assign a heist to yet.
              </p>
            )}
          </>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {error && <div className={styles.error}>{error}</div>}
            <Input
              id="title"
              name="title"
              type="text"
              label="Title"
              placeholder="Steal the office stapler"
              required
              disabled={loading}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className={styles.inputGroup}>
              <label htmlFor="description" className={styles.label}>
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe the mission"
                required
                disabled={loading}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={styles.textarea}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="assignedTo" className={styles.label}>
                Assign To
              </label>
              <select
                id="assignedTo"
                name="assignedTo"
                required
                disabled={loading}
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className={styles.select}
              >
                <option value="">Select an agent</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.codename}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating Heist..." : "Create Heist"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
