import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";

// hook imports
import { AuthProvider, useUser } from "@/lib/auth";

vi.mock("@/lib/firebase", () => ({ auth: {} }));
vi.mock("firebase/auth", () => ({ onAuthStateChanged: vi.fn() }));

function Consumer() {
  const { user, loading } = useUser();

  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="user">{user ? user.email : "null"}</span>
    </div>
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useUser", () => {
  it("returns null when the user is not authenticated", () => {
    vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
      (callback as (user: FirebaseUser | null) => void)(null);
      return vi.fn();
    });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    expect(screen.getByTestId("user")).toHaveTextContent("null");
  });

  it("returns the user object when the user is authenticated", () => {
    vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
      (callback as (user: FirebaseUser | null) => void)({
        uid: "abc123",
        email: "agent@pocketheist.com",
        displayName: "Agent A",
      } as FirebaseUser);
      return vi.fn();
    });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    expect(screen.getByTestId("user")).toHaveTextContent(
      "agent@pocketheist.com",
    );
  });

  it("returns loading state during initialization", () => {
    vi.mocked(onAuthStateChanged).mockImplementation(() => vi.fn());

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    expect(screen.getByTestId("loading")).toHaveTextContent("true");
  });

  it("throws an error when used outside of AuthProvider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Consumer />)).toThrow(
      "useUser must be used within AuthProvider",
    );
  });
});
