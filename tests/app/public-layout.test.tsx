import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { redirect } from "next/navigation";

// layout import
import RootLayout from "@/app/(public)/layout";
import { AuthProvider } from "@/lib/auth";

vi.mock("@/lib/firebase", () => ({ auth: {} }));
vi.mock("firebase/auth", () => ({ onAuthStateChanged: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

function renderLoading() {
  vi.mocked(onAuthStateChanged).mockImplementation(() => vi.fn());

  return render(
    <AuthProvider>
      <RootLayout>
        <div>Public Child</div>
      </RootLayout>
    </AuthProvider>,
  );
}

function renderAs(user: FirebaseUser | null) {
  vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
    (callback as (user: FirebaseUser | null) => void)(user);
    return vi.fn();
  });

  return render(
    <AuthProvider>
      <RootLayout>
        <div>Public Child</div>
      </RootLayout>
    </AuthProvider>,
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("(public) layout", () => {
  it("shows the loading spinner while auth status is resolving", () => {
    renderLoading();

    expect(
      screen.getByRole("status", { name: /loading/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Public Child")).not.toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("does not redirect while loading", () => {
    renderLoading();

    expect(redirect).not.toHaveBeenCalled();
  });

  it("renders children for an unauthenticated user", () => {
    renderAs(null);

    expect(screen.getByText("Public Child")).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("redirects an authenticated user to /heists", async () => {
    renderAs({
      uid: "abc123",
      email: "agent@pocketheist.com",
      displayName: "Agent A",
    } as FirebaseUser);

    await waitFor(() => expect(redirect).toHaveBeenCalledWith("/heists"));
    expect(screen.queryByText("Public Child")).not.toBeInTheDocument();
  });
});
