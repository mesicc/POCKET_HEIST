import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

// component imports
import LoadingSpinner from "@/components/LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders a loading status for assistive tech", () => {
    render(<LoadingSpinner />);

    expect(
      screen.getByRole("status", { name: /loading/i }),
    ).toBeInTheDocument();
  });

  it("renders the Clock icon", () => {
    render(<LoadingSpinner />);

    expect(screen.getByRole("status").querySelector("svg")).toBeInTheDocument();
  });
});
