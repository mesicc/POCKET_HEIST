import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";

// component imports
import SignupForm from "@/components/SignupForm";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("SignupForm", () => {
  it("renders the email field, password field and submit button", () => {
    render(<SignupForm />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
  });

  it("logs the credentials to the console on submit", async () => {
    const user = userEvent.setup();
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    render(<SignupForm />);

    await user.type(screen.getByLabelText("Email"), "new@example.com");
    await user.type(screen.getByLabelText("Password"), "hunter2");
    await user.click(screen.getByRole("button", { name: "Sign Up" }));

    expect(logSpy).toHaveBeenCalledWith({
      email: "new@example.com",
      password: "hunter2",
    });
  });

  it("prevents the default form submission so the page does not reload", async () => {
    const user = userEvent.setup();
    vi.spyOn(console, "log").mockImplementation(() => {});
    const onSubmit = vi.fn();
    document.addEventListener("submit", onSubmit);

    render(<SignupForm />);

    await user.type(screen.getByLabelText("Email"), "new@example.com");
    await user.type(screen.getByLabelText("Password"), "hunter2");
    await user.click(screen.getByRole("button", { name: "Sign Up" }));

    document.removeEventListener("submit", onSubmit);

    expect(onSubmit).toHaveBeenCalled();
    expect(onSubmit.mock.calls[0][0].defaultPrevented).toBe(true);
  });

  it("does not log credentials when the fields are empty", async () => {
    const user = userEvent.setup();
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    render(<SignupForm />);

    await user.click(screen.getByRole("button", { name: "Sign Up" }));

    expect(logSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({ password: expect.anything() }),
    );
  });

  it("links to the login page", () => {
    render(<SignupForm />);

    expect(screen.getByRole("link", { name: /log in/i })).toHaveAttribute(
      "href",
      "/login",
    );
  });
});
