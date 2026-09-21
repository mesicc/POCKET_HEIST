import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

// component imports
import Skeleton from "@/components/Skeleton"

describe("Skeleton", () => {
  it("renders a loading status for assistive tech", () => {
    render(<Skeleton />)

    expect(screen.getByRole("status", { name: /loading/i })).toBeInTheDocument()
  })
})
