import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import HeistCard, { HeistCardSkeleton } from "@/components/HeistCard";
import type { Heist } from "@/types/firestore";

const HOUR = 60 * 60 * 1000;

function makeHeist(overrides: Partial<Heist> = {}): Heist {
  return {
    id: "heist-1",
    title: "Replace all pens with crayons",
    description: "Subtle chaos",
    createdBy: "u1",
    createdByCodename: "SwiftFox",
    assignedTo: "u2",
    assignedToCodename: "SilentOwl",
    createdAt: new Date(),
    deadline: new Date(Date.now() + 5 * HOUR + 60 * 1000),
    finalStatus: null,
    ...overrides,
  };
}

describe("HeistCard", () => {
  it("renders the title, codenames and time remaining", () => {
    render(<HeistCard heist={makeHeist()} />);

    expect(
      screen.getByText("Replace all pens with crayons"),
    ).toBeInTheDocument();
    expect(screen.getByText("SilentOwl")).toBeInTheDocument();
    expect(screen.getByText("SwiftFox")).toBeInTheDocument();
    expect(screen.getByText("5 hours left")).toBeInTheDocument();
  });

  it("links the title to the heist details page", () => {
    render(<HeistCard heist={makeHeist({ id: "abc123" })} />);

    expect(
      screen.getByRole("link", { name: "Replace all pens with crayons" }),
    ).toHaveAttribute("href", "/heists/abc123");
  });

  it("only the title is a link", () => {
    render(<HeistCard heist={makeHeist()} />);

    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("styles the usernames with the primary and secondary colours", () => {
    render(<HeistCard heist={makeHeist()} />);

    expect(screen.getByText("SilentOwl").className).toMatch(/usernamePrimary/);
    expect(screen.getByText("SwiftFox").className).toMatch(/usernameSecondary/);
  });

  it("shows an overdue status when the deadline has passed", () => {
    render(
      <HeistCard
        heist={makeHeist({ deadline: new Date(Date.now() - HOUR) })}
      />,
    );

    expect(screen.getByText("Overdue").className).toMatch(/deadlineOverdue/);
  });
});

describe("HeistCardSkeleton", () => {
  it("renders a loading status without a link", () => {
    render(<HeistCardSkeleton />);

    expect(
      screen.getByRole("status", { name: /loading/i }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
