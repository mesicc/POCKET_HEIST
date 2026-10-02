import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { redirect } from "next/navigation";

// layout import
import HeistsLayout from "@/app/(dashboard)/layout";
import { AuthProvider } from "@/lib/auth";

vi.mock("@/lib/firebase", () => ({ auth: {} }));
vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn(),
  signOut: vi.fn(),
}));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

function renderLoading() {
  vi.mocked(onAuthStateChanged).mockImplementation(() => vi.fn());

  return render(
    <AuthProvider>
      <HeistsLayout>
        <div>Dashboard Child</div>
      </HeistsLayout>
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
      <HeistsLayout>
        <div>Dashboard Child</div>
      </HeistsLayout>
    </AuthProvider>,
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("(dashboard) layout", () => {
  it("shows the loading spinner while auth status is resolving", () => {
    renderLoading();

    expect(
      screen.getByRole("status", { name: /loading/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Dashboard Child")).not.toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("does not redirect while loading", () => {
    renderLoading();

    expect(redirect).not.toHaveBeenCalled();
  });

  it("renders the Navbar and children for an authenticated user", () => {
    renderAs({
      uid: "abc123",
      email: "agent@pocketheist.com",
      displayName: "Agent A",
    } as FirebaseUser);

    expect(screen.getByText("Dashboard Child")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("redirects an unauthenticated user to /login", async () => {
    renderAs(null);

    await waitFor(() => expect(redirect).toHaveBeenCalledWith("/login"));
    expect(screen.queryByText("Dashboard Child")).not.toBeInTheDocument();
  });
});
