import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { signInWithEmailAndPassword } from "firebase/auth";

// component imports
import LoginForm from "@/components/LoginForm";

vi.mock("@/lib/firebase", () => ({ auth: {} }));
vi.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(signInWithEmailAndPassword).mockResolvedValue({
    user: { uid: "uid-123" },
  } as never);
});

afterEach(() => {
  vi.restoreAllMocks();
});

async function fillAndSubmit(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Email"), "agent@example.com");
  await user.type(screen.getByLabelText("Password"), "hunter2");
  await user.click(screen.getByRole("button", { name: "Log In" }));
}

describe("LoginForm", () => {
  it("renders the email field, password field and submit button", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument();
  });

  it("prevents the default form submission so the page does not reload", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    document.addEventListener("submit", onSubmit);

    render(<LoginForm />);
    await fillAndSubmit(user);

    document.removeEventListener("submit", onSubmit);

    expect(onSubmit).toHaveBeenCalled();
    expect(onSubmit.mock.calls[0][0].defaultPrevented).toBe(true);
  });

  it("links to the signup page", () => {
    render(<LoginForm />);

    expect(screen.getByRole("link", { name: /sign up/i })).toHaveAttribute(
      "href",
      "/signup",
    );
  });

  it("does not call Firebase sign-in when the fields are empty", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: "Log In" }));

    expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
  });

  it("does not call Firebase sign-in when the email format is invalid", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText("Email"), "not-an-email");
    await user.type(screen.getByLabelText("Password"), "hunter2");
    await user.click(screen.getByRole("button", { name: "Log In" }));

    expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
  });

  it("signs the user in with the entered credentials on submit", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await fillAndSubmit(user);

    await waitFor(() =>
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        {},
        "agent@example.com",
        "hunter2",
      ),
    );
  });

  it("shows a success message after a successful login", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await fillAndSubmit(user);

    await waitFor(() =>
      expect(screen.getByText("Login successful")).toBeInTheDocument(),
    );
  });

  it("shows an error message and no success message on invalid credentials", async () => {
    vi.mocked(signInWithEmailAndPassword).mockRejectedValue({
      code: "auth/invalid-credential",
    });
    const user = userEvent.setup();
    render(<LoginForm />);

    await fillAndSubmit(user);

    await waitFor(() =>
      expect(
        screen.getByText(/invalid email or password/i),
      ).toBeInTheDocument(),
    );
    expect(screen.queryByText("Login successful")).not.toBeInTheDocument();
  });

  it("disables the form and shows a loading label while signing in", async () => {
    let resolveSignIn: (value: { user: { uid: string } }) => void;
    vi.mocked(signInWithEmailAndPassword).mockReturnValue(
      new Promise((resolve) => {
        resolveSignIn = resolve;
      }) as never,
    );
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText("Email"), "agent@example.com");
    await user.type(screen.getByLabelText("Password"), "hunter2");
    await user.click(screen.getByRole("button", { name: "Log In" }));

    expect(
      screen.getByRole("button", { name: "Logging In..." }),
    ).toBeDisabled();
    expect(screen.getByLabelText("Email")).toBeDisabled();
    expect(screen.getByLabelText("Password")).toBeDisabled();

    resolveSignIn!({ user: { uid: "uid-123" } });
    await waitFor(() =>
      expect(screen.getByText("Login successful")).toBeInTheDocument(),
    );
  });
});
