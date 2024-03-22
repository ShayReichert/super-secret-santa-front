import { render, screen, waitFor } from "@testing-library/react";
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

jest.mock("../../context/UserContext", () => ({
  useUser: jest.fn(),
}));

jest.mock("../../hook/useAuth/useAuth", () => ({
  useAuth: jest.fn(),
}));

describe("Footer Component", () => {
  it("renders without crashing", async () => {
    const usePathnameMock = require("next/navigation").usePathname;
    const useUserMock = require("../../context/UserContext").useUser;
    const useAuthMock = require("../../hook/useAuth/useAuth").useAuth;

    // Configurer les valeurs de retour des mocks
    usePathnameMock.mockReturnValue("/");
    useUserMock.mockReturnValue({
      userState: {
        data: {
          roles: ["ROLE_ADMIN"],
        },
      },
    });
    useAuthMock.mockReturnValue({
      isLoggedIn: () => true,
    });

    render(<Footer />);

    await waitFor(() => {
      expect(screen.getByText("Menu component")).toBeInTheDocument();
    });

    expect(screen.getByText("Alexis et Shay")).toBeInTheDocument();
  });
});
