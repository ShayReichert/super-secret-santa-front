import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Footer from "./Footer";

// Mocks for dependencies
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("../MenuUser/MenuUser", () => {
  const MenuUserMock = () => <div>Menu component</div>;
  MenuUserMock.displayName = "MenuUser";
  return MenuUserMock;
});

jest.mock("../MenuEvents/MenuEvents", () => {
  const MenuEventsMock = () => <div>Menu events component</div>;
  MenuEventsMock.displayName = "MenuEvents";
  return MenuEventsMock;
});

jest.mock("../../context/UserContext", () => ({
  useUser: jest.fn(),
}));

describe("Footer Component", () => {
  it("renders without crashing", () => {
    const usePathnameMock = require("next/navigation").usePathname;
    const useUserMock = require("../../context/UserContext").useUser;

    // Configurer les valeurs de retour des mocks
    usePathnameMock.mockReturnValue("/");
    useUserMock.mockReturnValue({
      userState: {
        data: {
          roles: ["ROLE_ADMIN"],
        },
      },
    });

    render(<Footer />);
    expect(screen.getByText("Menu component")).toBeInTheDocument();
    expect(screen.getByText("Alexis et Shay")).toBeInTheDocument();
  });
});
