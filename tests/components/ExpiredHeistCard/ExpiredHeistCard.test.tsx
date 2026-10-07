import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import ExpiredHeistCard, {
  ExpiredHeistCardSkeleton,
} from "@/components/ExpiredHeistCard";
import type { Heist } from "@/types/firestore";

function makeHeist(overrides: Partial<Heist> = {}): Heist {
  return {
    id: "heist-1",
    title: "Replace all pens with crayons",
    description: "Subtle chaos",
    createdBy: "u1",
    createdByCodename: "SwiftFox",
    assignedTo: "u2",
    assignedToCodename: "SilentOwl",
    createdAt: new Date("2026-01-01T09:00:00"),
    deadline: new Date("2026-01-03T09:00:00"),
    finalStatus: "failure",
    ...overrides,
  };
}

describe("ExpiredHeistCard", () => {
  it("shows the FAILED badge and title for a failed heist", () => {
    render(<ExpiredHeistCard heist={makeHeist({ finalStatus: "failure" })} />);

    expect(screen.getByText("FAILED")).toBeInTheDocument();
    expect(screen.queryByText("SUCCESS")).not.toBeInTheDocument();
    expect(
      screen.getByText("Replace all pens with crayons"),
    ).toBeInTheDocument();
  });

  it("shows the SUCCESS badge and title for a successful heist", () => {
    render(<ExpiredHeistCard heist={makeHeist({ finalStatus: "success" })} />);

    expect(screen.getByText("SUCCESS")).toBeInTheDocument();
    expect(screen.queryByText("FAILED")).not.toBeInTheDocument();
    expect(
      screen.getByText("Replace all pens with crayons"),
    ).toBeInTheDocument();
  });

  it("renders the assignee codename with the To: label in the primary colour", () => {
    render(<ExpiredHeistCard heist={makeHeist()} />);

    expect(screen.getByText("To:")).toBeInTheDocument();
    expect(screen.getByText("SilentOwl").className).toMatch(/codename/);
  });

  it("links only the title to the heist details page", () => {
    render(<ExpiredHeistCard heist={makeHeist({ id: "abc123" })} />);

    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(
      screen.getByRole("link", { name: "Replace all pens with crayons" }),
    ).toHaveAttribute("href", "/heists/abc123");
  });

  it("renders the deadline timestamp", () => {
    render(<ExpiredHeistCard heist={makeHeist()} />);

    expect(screen.getByText(/Jan 3/)).toBeInTheDocument();
  });
});

describe("ExpiredHeistCardSkeleton", () => {
  it("renders a loading status without a link", () => {
    render(<ExpiredHeistCardSkeleton />);

    expect(
      screen.getByRole("status", { name: /loading/i }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
