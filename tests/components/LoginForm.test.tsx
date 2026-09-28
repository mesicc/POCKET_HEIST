import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";

// component imports
import LoginForm from "@/components/LoginForm";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("LoginForm", () => {
  it("renders the email field, password field and submit button", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument();
  });

  it("logs the credentials to the console on submit", async () => {
    const user = userEvent.setup();
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    render(<LoginForm />);

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Password"), "hunter2");
    await user.click(screen.getByRole("button", { name: "Log In" }));

    expect(logSpy).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "hunter2",
    });
  });

  it("prevents the default form submission so the page does not reload", async () => {
    const user = userEvent.setup();
    vi.spyOn(console, "log").mockImplementation(() => {});
    const onSubmit = vi.fn();
    document.addEventListener("submit", onSubmit);

    render(<LoginForm />);

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Password"), "hunter2");
    await user.click(screen.getByRole("button", { name: "Log In" }));

    document.removeEventListener("submit", onSubmit);

    expect(onSubmit).toHaveBeenCalled();
    expect(onSubmit.mock.calls[0][0].defaultPrevented).toBe(true);
  });

  it("does not log credentials when the fields are empty", async () => {
    const user = userEvent.setup();
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: "Log In" }));

    expect(logSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({ password: expect.anything() }),
    );
  });

  it("does not log credentials when the email format is invalid", async () => {
    const user = userEvent.setup();
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    render(<LoginForm />);

    await user.type(screen.getByLabelText("Email"), "not-an-email");
    await user.type(screen.getByLabelText("Password"), "hunter2");
    await user.click(screen.getByRole("button", { name: "Log In" }));

    expect(logSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({ password: expect.anything() }),
    );
  });

  it("links to the signup page", () => {
    render(<LoginForm />);

    expect(screen.getByRole("link", { name: /sign up/i })).toHaveAttribute(
      "href",
      "/signup",
    );
  });
});
