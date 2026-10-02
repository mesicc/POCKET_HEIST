import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";
import {
  onAuthStateChanged,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";

// component imports
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/lib/auth";
import { auth } from "@/lib/firebase";

vi.mock("@/lib/firebase", () => ({ auth: {} }));
vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn(),
  signOut: vi.fn(),
}));

function renderSignedIn() {
  vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
    (callback as (user: FirebaseUser | null) => void)({
      uid: "abc123",
      email: "agent@pocketheist.com",
      displayName: "Agent A",
    } as FirebaseUser);
    return vi.fn();
  });

  return render(
    <AuthProvider>
      <Navbar />
    </AuthProvider>,
  );
}

function renderSignedOut() {
  vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
    (callback as (user: FirebaseUser | null) => void)(null);
    return vi.fn();
  });

  return render(
    <AuthProvider>
      <Navbar />
    </AuthProvider>,
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Navbar", () => {
  it("renders the main heading", () => {
    renderSignedOut();

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it("renders the Create Heist link", () => {
    renderSignedOut();

    const createLink = screen.getByRole("link", { name: /create heist/i });
    expect(createLink).toBeInTheDocument();
    expect(createLink).toHaveAttribute("href", "/heists/create");
  });

  it("renders the logout button when the user is signed in", () => {
    renderSignedIn();

    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  it("does not render the logout button when the user is signed out", () => {
    renderSignedOut();

    expect(
      screen.queryByRole("button", { name: /logout/i }),
    ).not.toBeInTheDocument();
  });

  it("calls Firebase signOut when the logout button is clicked", async () => {
    const user = userEvent.setup();
    renderSignedIn();

    await user.click(screen.getByRole("button", { name: /logout/i }));

    await waitFor(() => expect(signOut).toHaveBeenCalledWith(auth));
  });

  it("renders the user's avatar when signed in", () => {
    renderSignedIn();

    expect(screen.getByRole("img", { name: "Agent A" })).toBeInTheDocument();
  });

  it("does not render an avatar when signed out", () => {
    renderSignedOut();

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
