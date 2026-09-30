import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";

// component imports
import PasswordInput from "@/components/PasswordInput";

describe("PasswordInput", () => {
  it("renders a masked password field by default", () => {
    render(
      <PasswordInput
        id="password"
        name="password"
        label="Password"
        value=""
        onChange={() => {}}
      />,
    );

    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "type",
      "password",
    );
  });

  it("reveals the password when the toggle is clicked", async () => {
    const user = userEvent.setup();

    render(
      <PasswordInput
        id="password"
        name="password"
        label="Password"
        value="hunter2"
        onChange={() => {}}
      />,
    );

    await user.click(screen.getByRole("button", { name: /show password/i }));

    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "text");
  });

  it("masks the password again when the toggle is clicked twice", async () => {
    const user = userEvent.setup();

    render(
      <PasswordInput
        id="password"
        name="password"
        label="Password"
        value="hunter2"
        onChange={() => {}}
      />,
    );

    await user.click(screen.getByRole("button", { name: /show password/i }));
    await user.click(screen.getByRole("button", { name: /hide password/i }));

    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "type",
      "password",
    );
  });

  it("does not submit the surrounding form when toggled", () => {
    render(
      <PasswordInput
        id="password"
        name="password"
        label="Password"
        value=""
        onChange={() => {}}
      />,
    );

    expect(
      screen.getByRole("button", { name: /show password/i }),
    ).toHaveAttribute("type", "button");
  });
});
