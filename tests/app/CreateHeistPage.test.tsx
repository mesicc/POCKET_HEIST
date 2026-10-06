import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { addDoc, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/auth";

import CreateHeistPage from "@/app/(dashboard)/heists/create/page";

vi.mock("@/lib/firebase", () => ({ auth: {}, db: {} }));
vi.mock("firebase/firestore", () => ({
  addDoc: vi.fn(),
  collection: vi.fn((_db: unknown, name: string) => ({ name })),
  getDocs: vi.fn(),
  serverTimestamp: vi.fn(() => "SERVER_TIMESTAMP"),
}));
vi.mock("next/navigation", () => ({ useRouter: vi.fn() }));
vi.mock("@/lib/auth", () => ({ useUser: vi.fn() }));

const push = vi.fn();

function mockUsers(users: { id: string; codename: string }[]) {
  vi.mocked(getDocs).mockResolvedValue({
    docs: users.map((u) => ({
      id: u.id,
      data: () => ({ codename: u.codename }),
    })),
  } as never);
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useRouter).mockReturnValue({ push } as never);
  vi.mocked(useUser).mockReturnValue({
    user: { uid: "me", email: "me@example.com", displayName: "MeAgent" },
    loading: false,
  });
  vi.mocked(addDoc).mockResolvedValue({} as never);
  mockUsers([
    { id: "me", codename: "MeAgent" },
    { id: "u2", codename: "SilentCrimsonFalcon" },
    { id: "u3", codename: "QuickAmberOtter" },
  ]);
});

afterEach(() => {
  vi.restoreAllMocks();
});

async function renderForm() {
  render(<CreateHeistPage />);
  await screen.findByLabelText("Title");
}

describe("CreateHeistPage", () => {
  it("renders the title, description and assignee fields", async () => {
    await renderForm();

    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Assign To")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create Heist" }),
    ).toBeInTheDocument();
  });

  it("lists other users in the dropdown and excludes the current user", async () => {
    await renderForm();

    expect(
      screen.getByRole("option", { name: "SilentCrimsonFalcon" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "QuickAmberOtter" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "MeAgent" }),
    ).not.toBeInTheDocument();
  });

  it("shows a message instead of the form when there are no other users", async () => {
    mockUsers([{ id: "me", codename: "MeAgent" }]);
    render(<CreateHeistPage />);

    expect(
      await screen.findByText(/no other agents to assign/i),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Title")).not.toBeInTheDocument();
  });

  it("shows validation errors and does not write when fields are empty", async () => {
    const user = userEvent.setup();
    await renderForm();

    await user.click(screen.getByRole("button", { name: "Create Heist" }));
    expect(await screen.findByText("Title is required")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Title"), "Steal the stapler");
    await user.click(screen.getByRole("button", { name: "Create Heist" }));
    expect(
      await screen.findByText("Description is required"),
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText("Description"), "Quietly.");
    await user.click(screen.getByRole("button", { name: "Create Heist" }));
    expect(
      await screen.findByText(/select a user to assign/i),
    ).toBeInTheDocument();

    expect(addDoc).not.toHaveBeenCalled();
  });

  it("creates the heist with the correct data and redirects to /heists", async () => {
    const user = userEvent.setup();
    await renderForm();
    const before = Date.now();

    await user.type(screen.getByLabelText("Title"), "  Steal the stapler ");
    await user.type(screen.getByLabelText("Description"), "Quietly.");
    await user.selectOptions(screen.getByLabelText("Assign To"), "u2");
    await user.click(screen.getByRole("button", { name: "Create Heist" }));

    await waitFor(() => expect(addDoc).toHaveBeenCalledTimes(1));
    const [ref, data] = vi.mocked(addDoc).mock.calls[0] as unknown as [
      { name: string },
      Record<string, unknown>,
    ];

    expect(ref.name).toBe("heists");
    expect(data).toMatchObject({
      title: "Steal the stapler",
      description: "Quietly.",
      createdBy: "me",
      createdByCodename: "MeAgent",
      assignedTo: "u2",
      assignedToCodename: "SilentCrimsonFalcon",
      createdAt: "SERVER_TIMESTAMP",
      finalStatus: null,
    });

    const deadline = (data.deadline as Date).getTime();
    const fortyEightHours = 48 * 60 * 60 * 1000;
    expect(deadline).toBeGreaterThanOrEqual(before + fortyEightHours - 1000);
    expect(deadline).toBeLessThanOrEqual(Date.now() + fortyEightHours + 1000);

    await waitFor(() => expect(push).toHaveBeenCalledWith("/heists"));
  });

  it("shows a loading state while submitting", async () => {
    const user = userEvent.setup();
    vi.mocked(addDoc).mockReturnValue(new Promise(() => {}) as never);
    await renderForm();

    await user.type(screen.getByLabelText("Title"), "Steal the stapler");
    await user.type(screen.getByLabelText("Description"), "Quietly.");
    await user.selectOptions(screen.getByLabelText("Assign To"), "u2");
    await user.click(screen.getByRole("button", { name: "Create Heist" }));

    const button = await screen.findByRole("button", {
      name: "Creating Heist...",
    });
    expect(button).toBeDisabled();
    expect(push).not.toHaveBeenCalled();
  });

  it("shows an error and keeps the input when saving fails", async () => {
    const user = userEvent.setup();
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(addDoc).mockRejectedValue(new Error("boom"));
    await renderForm();

    await user.type(screen.getByLabelText("Title"), "Steal the stapler");
    await user.type(screen.getByLabelText("Description"), "Quietly.");
    await user.selectOptions(screen.getByLabelText("Assign To"), "u2");
    await user.click(screen.getByRole("button", { name: "Create Heist" }));

    expect(
      await screen.findByText("Failed to create heist. Please try again."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toHaveValue("Steal the stapler");
    expect(push).not.toHaveBeenCalled();
  });

  it("shows an error when users cannot be loaded", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(getDocs).mockRejectedValue(new Error("offline"));
    render(<CreateHeistPage />);

    expect(
      await screen.findByText("Failed to load users. Please try again."),
    ).toBeInTheDocument();
  });
});
