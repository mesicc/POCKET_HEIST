import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

// component imports
import Input from "@/components/Input";

describe("Input", () => {
  it("renders the label and placeholder", () => {
    render(
      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        value=""
        onChange={() => {}}
      />,
    );

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
  });

  it("calls onChange when the user types", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        value=""
        onChange={handleChange}
      />,
    );

    await user.type(screen.getByLabelText("Email"), "a");

    expect(handleChange).toHaveBeenCalled();
  });

  it("applies the required attribute and input type", () => {
    render(
      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        required
        value=""
        onChange={() => {}}
      />,
    );

    const input = screen.getByLabelText("Email");
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("type", "email");
  });
});
