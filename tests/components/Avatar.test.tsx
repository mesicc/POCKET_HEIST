import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

// component imports
import Avatar from "@/components/Avatar"

describe("Avatar", () => {
  it("renders successfully", () => {
    render(<Avatar name="Alice" />)

    expect(screen.getByRole("img")).toBeInTheDocument()
  })

  it("renders the first letter for a simple name", () => {
    render(<Avatar name="john" />)

    expect(screen.getByRole("img", { name: "john" })).toHaveTextContent("J")
  })

  it("renders the first two uppercase letters for a PascalCase name", () => {
    render(<Avatar name="JohnDoe" />)

    expect(screen.getByRole("img", { name: "JohnDoe" })).toHaveTextContent("JD")
  })
})
