import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "./Header";

// Mocks for dependencies
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("../Menu/Menu", () => () => <div>Menu component</div>);

jest.mock("../../hook/useAuth.ts", () => ({
  useAuth: () => ({
    isLoggedIn: jest.fn(),
  }),
}));

describe("Header Component", () => {
  // Test for rendering the Header component
  it("renders without crashing", () => {
    require("next/navigation").usePathname.mockReturnValue("/");
    require("../../hook/useAuth.ts").useAuth = () => ({
      isLoggedIn: () => true,
    });
    const { getByText } = render(<Header />);
    expect(getByText("🎄 Secret Santa 🎄")).toBeInTheDocument();
  });

  // Test for menu visibility when logged in
  it("shows menu when logged in", () => {
    require("next/navigation").usePathname.mockReturnValue("/");
    require("../../hook/useAuth.ts").useAuth = () => ({
      isLoggedIn: () => true,
    });

    const { getByText } = render(<Header />);
    expect(getByText("Menu component")).toBeInTheDocument();
  });

  // Test for no menu when not logged in
  it("does not show menu when not logged in", () => {
    require("next/navigation").usePathname.mockReturnValue("/");
    require("../../hook/useAuth.ts").useAuth = () => ({
      isLoggedIn: () => false,
    });

    const { queryByText } = render(<Header />);
    expect(queryByText("Menu component")).not.toBeInTheDocument();
  });

  // Test for admin class applied on admin pages
  it("applies admin class on admin pages", () => {
    require("next/navigation").usePathname.mockReturnValue("/admin");
    require("../../hook/useAuth.ts").useAuth = () => ({
      isLoggedIn: () => true,
    });

    const { container } = render(<Header />);
    expect(container.firstChild).toHaveClass("header-admin");
  });
});
