import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { onSnapshot, where, orderBy } from "firebase/firestore";

import { useHeists } from "@/lib/hooks";
import { useUser } from "@/lib/auth";

vi.mock("@/lib/firebase", () => ({ db: {} }));
vi.mock("@/lib/auth", () => ({ useUser: vi.fn() }));
vi.mock("firebase/firestore", () => ({
  collection: vi.fn(() => ({ withConverter: vi.fn(() => "heistsRef") })),
  query: vi.fn((...args) => args),
  where: vi.fn((...args) => ({ where: args })),
  orderBy: vi.fn((...args) => ({ orderBy: args })),
  onSnapshot: vi.fn(),
}));

type Next = (snapshot: { docs: { data: () => unknown }[] }) => void;
type Err = (error: Error) => void;

function snapshotOf(...heists: { id: string; title: string }[]) {
  return { docs: heists.map((heist) => ({ data: () => heist })) };
}

let next: Next;
let fail: Err;
const unsubscribe = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useUser).mockReturnValue({
    user: { uid: "user-1", email: null, displayName: null },
    loading: false,
  });
  vi.mocked(onSnapshot).mockImplementation(((
    _q: unknown,
    onNext: Next,
    onError: Err,
  ) => {
    next = onNext;
    fail = onError;
    return unsubscribe;
  }) as never);
});

describe("useHeists", () => {
  it("queries heists assigned to the user with a future deadline for 'active'", () => {
    renderHook(() => useHeists("active"));

    expect(where).toHaveBeenCalledWith("assignedTo", "==", "user-1");
    expect(where).toHaveBeenCalledWith("deadline", ">", expect.any(Date));
  });

  it("queries heists created by the user with a future deadline for 'assigned'", () => {
    renderHook(() => useHeists("assigned"));

    expect(where).toHaveBeenCalledWith("createdBy", "==", "user-1");
    expect(where).toHaveBeenCalledWith("deadline", ">", expect.any(Date));
  });

  it("queries past-deadline heists with a final status, newest first, for 'expired'", () => {
    renderHook(() => useHeists("expired"));

    expect(where).toHaveBeenCalledWith("deadline", "<", expect.any(Date));
    expect(where).toHaveBeenCalledWith("finalStatus", "!=", null);
    expect(orderBy).toHaveBeenCalledWith("deadline", "desc");
    expect(where).not.toHaveBeenCalledWith(
      "assignedTo",
      "==",
      expect.anything(),
    );
    expect(where).not.toHaveBeenCalledWith(
      "createdBy",
      "==",
      expect.anything(),
    );
  });

  it("returns an empty array while loading and when nothing matches", () => {
    const { result } = renderHook(() => useHeists("active"));
    expect(result.current).toEqual({ heists: [], loading: true, error: null });

    act(() => next(snapshotOf()));
    expect(result.current).toEqual({ heists: [], loading: false, error: null });
  });

  it("updates when the snapshot listener emits new data", () => {
    const { result } = renderHook(() => useHeists("active"));

    act(() => next(snapshotOf({ id: "1", title: "Steal the stapler" })));
    expect(result.current.heists.map((h) => h.title)).toEqual([
      "Steal the stapler",
    ]);

    act(() =>
      next(
        snapshotOf(
          { id: "1", title: "Steal the stapler" },
          { id: "2", title: "Swap the biscuits" },
        ),
      ),
    );
    expect(result.current.heists).toHaveLength(2);
  });

  it("exposes an error when the listener fails", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { result } = renderHook(() => useHeists("active"));

    act(() => fail(new Error("boom")));

    expect(result.current).toEqual({
      heists: [],
      loading: false,
      error: "Failed to load heists",
    });
  });

  it("unsubscribes from the listener on unmount", () => {
    const { unmount } = renderHook(() => useHeists("active"));

    unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });

  it("does not subscribe when there is no user", () => {
    vi.mocked(useUser).mockReturnValue({ user: null, loading: false });

    const { result } = renderHook(() => useHeists("active"));

    expect(onSnapshot).not.toHaveBeenCalled();
    expect(result.current).toEqual({ heists: [], loading: false, error: null });
  });
});
