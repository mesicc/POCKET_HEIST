import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

// component imports
import SignupForm from "@/components/SignupForm";
import { generateCodename } from "@/lib/utils/codename";

vi.mock("@/lib/firebase", () => ({ auth: {}, db: {} }));
vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
}));
vi.mock("firebase/firestore", () => ({
  doc: vi.fn(),
  setDoc: vi.fn(),
}));
vi.mock("next/navigation", () => ({ useRouter: vi.fn() }));
vi.mock("@/lib/utils/codename", () => ({ generateCodename: vi.fn() }));

const push = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({
    user: { uid: "uid-123" },
  } as never);
  vi.mocked(updateProfile).mockResolvedValue(undefined as never);
  vi.mocked(doc).mockReturnValue({} as never);
  vi.mocked(setDoc).mockResolvedValue(undefined as never);
  vi.mocked(generateCodename).mockReturnValue("SilentCrimsonFalcon");
  vi.mocked(useRouter).mockReturnValue({ push } as never);
});

afterEach(() => {
  vi.restoreAllMocks();
});

async function fillAndSubmit(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Email"), "new@example.com");
  await user.type(screen.getByLabelText("Password"), "hunter2");
  await user.click(screen.getByRole("button", { name: "Sign Up" }));
}

describe("SignupForm", () => {
  it("renders the email field, password field and submit button", () => {
    render(<SignupForm />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
  });

  it("prevents the default form submission so the page does not reload", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    document.addEventListener("submit", onSubmit);

    render(<SignupForm />);
    await fillAndSubmit(user);

    document.removeEventListener("submit", onSubmit);

    expect(onSubmit).toHaveBeenCalled();
    expect(onSubmit.mock.calls[0][0].defaultPrevented).toBe(true);
  });

  it("links to the login page", () => {
    render(<SignupForm />);

    expect(screen.getByRole("link", { name: /log in/i })).toHaveAttribute(
      "href",
      "/login",
    );
  });

  it("creates a Firebase Auth account with the entered credentials on submit", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await fillAndSubmit(user);

    await waitFor(() =>
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        {},
        "new@example.com",
        "hunter2",
      ),
    );
  });

  it("sets the generated codename as the new user's display name", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await fillAndSubmit(user);

    await waitFor(() =>
      expect(updateProfile).toHaveBeenCalledWith(
        { uid: "uid-123" },
        { displayName: "SilentCrimsonFalcon" },
      ),
    );
  });

  it("creates a users document with id and codename but never the email", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await fillAndSubmit(user);

    await waitFor(() => expect(setDoc).toHaveBeenCalled());

    const [, data] = vi.mocked(setDoc).mock.calls[0];
    expect(data).toEqual({ id: "uid-123", codename: "SilentCrimsonFalcon" });
    expect(Object.keys(data as object)).not.toContain("email");
  });

  it("redirects to /heists after a successful signup", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await fillAndSubmit(user);

    await waitFor(() => expect(push).toHaveBeenCalledWith("/heists"));
  });

  it("shows an error message and does not redirect when the email is already in use", async () => {
    vi.mocked(createUserWithEmailAndPassword).mockRejectedValue({
      code: "auth/email-already-in-use",
    });
    const user = userEvent.setup();
    render(<SignupForm />);

    await fillAndSubmit(user);

    await waitFor(() =>
      expect(screen.getByText(/already registered/i)).toBeInTheDocument(),
    );
    expect(push).not.toHaveBeenCalled();
    expect(updateProfile).not.toHaveBeenCalled();
    expect(setDoc).not.toHaveBeenCalled();
  });

  it("shows an error message for a weak password", async () => {
    vi.mocked(createUserWithEmailAndPassword).mockRejectedValue({
      code: "auth/weak-password",
    });
    const user = userEvent.setup();
    render(<SignupForm />);

    await fillAndSubmit(user);

    await waitFor(() =>
      expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument(),
    );
  });

  it("disables the form and shows a loading label while signup is in progress", async () => {
    let resolveSignup: (value: { user: { uid: string } }) => void;
    vi.mocked(createUserWithEmailAndPassword).mockReturnValue(
      new Promise((resolve) => {
        resolveSignup = resolve;
      }) as never,
    );
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByLabelText("Email"), "new@example.com");
    await user.type(screen.getByLabelText("Password"), "hunter2");
    await user.click(screen.getByRole("button", { name: "Sign Up" }));

    expect(
      screen.getByRole("button", { name: "Creating Account..." }),
    ).toBeDisabled();
    expect(screen.getByLabelText("Email")).toBeDisabled();
    expect(screen.getByLabelText("Password")).toBeDisabled();

    resolveSignup!({ user: { uid: "uid-123" } });
    await waitFor(() => expect(push).toHaveBeenCalledWith("/heists"));
  });
});
