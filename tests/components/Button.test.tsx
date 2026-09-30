import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

// component imports
import Button from "@/components/Button";

describe("Button", () => {
  it("renders its children", () => {
    render(<Button>Log In</Button>);

    expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument();
  });

  it("defaults to a submit button", () => {
    render(<Button>Log In</Button>);

    expect(screen.getByRole("button", { name: "Log In" })).toHaveAttribute(
      "type",
      "submit",
    );
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button type="button" onClick={handleClick}>
        Toggle
      </Button>,
    );

    await user.click(screen.getByRole("button", { name: "Toggle" }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("can be disabled", () => {
    render(<Button disabled>Log In</Button>);

    expect(screen.getByRole("button", { name: "Log In" })).toBeDisabled();
  });
});
