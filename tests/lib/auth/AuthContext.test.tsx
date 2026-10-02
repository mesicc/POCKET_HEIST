import { act, render, screen } from "@testing-library/react";
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

describe("AuthProvider", () => {
  it("renders children successfully", () => {
    vi.mocked(onAuthStateChanged).mockImplementation(() => vi.fn());

    render(
      <AuthProvider>
        <div>child content</div>
      </AuthProvider>,
    );

    expect(screen.getByText("child content")).toBeInTheDocument();
  });

  it("starts with loading true before Firebase responds", () => {
    vi.mocked(onAuthStateChanged).mockImplementation(() => vi.fn());

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    expect(screen.getByTestId("loading")).toHaveTextContent("true");
  });

  it("sets loading to false once Firebase initializes", () => {
    let authCallback: (user: FirebaseUser | null) => void = () => {};
    vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
      authCallback = callback as (user: FirebaseUser | null) => void;
      return vi.fn();
    });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    act(() => {
      authCallback(null);
    });

    expect(screen.getByTestId("loading")).toHaveTextContent("false");
  });

  it("updates the user when the Firebase auth state changes", () => {
    let authCallback: (user: FirebaseUser | null) => void = () => {};
    vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
      authCallback = callback as (user: FirebaseUser | null) => void;
      return vi.fn();
    });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    act(() => {
      authCallback({
        uid: "abc123",
        email: "agent@pocketheist.com",
        displayName: "Agent A",
      } as FirebaseUser);
    });
    expect(screen.getByTestId("user")).toHaveTextContent(
      "agent@pocketheist.com",
    );

    act(() => {
      authCallback(null);
    });
    expect(screen.getByTestId("user")).toHaveTextContent("null");
  });
});
