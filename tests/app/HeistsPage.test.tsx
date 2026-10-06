import { render, screen, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import HeistsPage from "@/app/(dashboard)/heists/page";
import { useHeists } from "@/lib/hooks";

vi.mock("@/lib/hooks", () => ({ useHeists: vi.fn() }));

const results = {
  active: ["Active one"],
  assigned: ["Assigned one", "Assigned two"],
  expired: ["Expired one"],
};

describe("HeistsPage", () => {
  it("renders the titles from each result set under its heading", () => {
    vi.mocked(useHeists).mockImplementation(
      (filter) =>
        ({
          heists: results[filter].map((title, i) => ({
            id: `${filter}-${i}`,
            title,
          })),
          loading: false,
          error: null,
        }) as never,
    );

    const { container } = render(<HeistsPage />);

    const section = (cls: string) =>
      within(container.querySelector(`.${cls}`) as HTMLElement);

    expect(
      section("active-heists").getByText("Active one"),
    ).toBeInTheDocument();
    expect(
      section("assigned-heists").getByText("Assigned one"),
    ).toBeInTheDocument();
    expect(
      section("assigned-heists").getByText("Assigned two"),
    ).toBeInTheDocument();
    expect(
      section("expired-heists").getByText("Expired one"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("shows an empty message when a result set is empty", () => {
    vi.mocked(useHeists).mockReturnValue({
      heists: [],
      loading: false,
      error: null,
    });

    render(<HeistsPage />);

    expect(screen.getByText("No active heists")).toBeInTheDocument();
  });
});
