import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Footer from "./Footer";

// Mocks for dependencies
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("../Menu/Menu", () => () => <div>Menu component</div>);

jest.mock("../MenuEvents/MenuEvents", () => () => <div>Menu events component</div>);

jest.mock("../../context/UserContext.tsx", () => ({
  useUser: () => ({
    userState: {
      data: {
        roles: ["ROLE_USER"],
      },
    },
  }),
}));

describe("Footer Component", () => {
  // Test for rendering the Footer component
  it("renders without crashing", () => {
    require("next/navigation").usePathname.mockReturnValue("/");
    require("../../context/UserContext.tsx").useUser = () => ({
      userState: {
        data: {
          roles: ["ROLE_ADMIN"],
        },
      },
    });
    const { getByText } = render(<Footer />);
    expect(getByText("Alexis et Shay")).toBeInTheDocument();
  });

  // Test for admin link visibility
  it("shows admin access link for admin users", () => {
    require("next/navigation").usePathname.mockReturnValue("/");
    require("../../context/UserContext.tsx").useUser = () => ({
      userState: {
        data: {
          roles: ["ROLE_ADMIN"],
        },
      },
    });

    const { getByText } = render(<Footer />);
    expect(getByText("📊 Accès admin")).toBeInTheDocument();
  });

  // Test for admin link not being visible for non-admin pages
  it("does not show admin access link on admin pages", () => {
    require("next/navigation").usePathname.mockReturnValue("/admin");
    require("../../context/UserContext.tsx").useUser = () => ({
      userState: {
        data: {
          roles: ["ROLE_ADMIN"],
        },
      },
    });

    const { queryByText } = render(<Footer />);
    expect(queryByText("📊 Accès admin")).not.toBeInTheDocument();
  });
});
