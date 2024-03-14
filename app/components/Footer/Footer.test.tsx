import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Footer from "./Footer";

// Mocks for dependencies
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("../MenuUser/MenuUser", () => () => <div>Menu component</div>);

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
});
