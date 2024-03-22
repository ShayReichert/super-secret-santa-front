import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "./Header";
import * as NavigationHook from "next/navigation";
import * as AuthHook from "../../hook/useAuth/useAuth";
import * as UserContext from "../../context/UserContext";

// Mocks for dependencies
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("../../context/UserContext", () => ({
  useUser: jest.fn(),
}));

jest.mock("../../hook/useAuth/useAuth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../MenuUser/MenuUser", () => {
  const MenuUserMock = () => <div>MenuUser component</div>;
  MenuUserMock.displayName = "MenuUser";
  return MenuUserMock;
});

jest.mock("../MenuEvents/MenuEvents", () => {
  const MenuEventsMock = () => <div>MenuEvents component</div>;
  MenuEventsMock.displayName = "MenuEvents";
  return MenuEventsMock;
});

describe("Header Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    jest.spyOn(NavigationHook, "usePathname").mockReturnValue("/");

    (AuthHook.useAuth as jest.Mock).mockImplementation(() => ({
      isLoggedIn: () => true,
    }));
    (UserContext.useUser as jest.Mock).mockImplementation(() => ({
      isAdministrator: false,
      canOnlyManageEvent: false,
    }));

    render(<Header />);
    expect(screen.getByText("🎄 Secret Santa 🎄")).toBeInTheDocument();
  });

  it("shows MenuUser and MenuEvents when logged in", () => {
    jest.spyOn(NavigationHook, "usePathname").mockReturnValue("/");
    (AuthHook.useAuth as jest.Mock).mockImplementation(() => ({
      isLoggedIn: () => true,
    }));
    (UserContext.useUser as jest.Mock).mockImplementation(() => ({
      isAdministrator: false,
      canOnlyManageEvent: false,
    }));

    render(<Header />);
    expect(screen.getByText("MenuUser component")).toBeInTheDocument();
    const menuEventsComponents = screen.queryAllByText("MenuEvents component");
    expect(menuEventsComponents.length).toBeGreaterThan(0);
  });

  it("does not show MenuUser and MenuEvents when not logged in", () => {
    jest.spyOn(NavigationHook, "usePathname").mockReturnValue("/");
    (AuthHook.useAuth as jest.Mock).mockImplementation(() => ({
      isLoggedIn: () => false,
    }));
    (UserContext.useUser as jest.Mock).mockImplementation(() => ({
      isAdministrator: false,
      canOnlyManageEvent: false,
    }));

    render(<Header />);
    expect(screen.queryByText("MenuUser component")).not.toBeInTheDocument();
    const menuEventsComponents = screen.queryAllByText("MenuEvents component");
    expect(menuEventsComponents.length).toBe(0);
  });

  it("applies admin class on admin pages for administrators", () => {
    jest.spyOn(NavigationHook, "usePathname").mockReturnValue("/admin");
    (AuthHook.useAuth as jest.Mock).mockImplementation(() => ({
      isLoggedIn: () => true,
    }));
    (UserContext.useUser as jest.Mock).mockImplementation(() => ({
      isAdministrator: true,
      canOnlyManageEvent: false,
    }));

    render(<Header />);
    expect(screen.getByTestId("header")).toHaveClass("header-admin");
  });

  it("applies organizer class on admin pages for organizers", () => {
    jest.spyOn(NavigationHook, "usePathname").mockReturnValue("/admin");
    (AuthHook.useAuth as jest.Mock).mockImplementation(() => ({
      isLoggedIn: () => true,
    }));
    (UserContext.useUser as jest.Mock).mockImplementation(() => ({
      isAdministrator: false,
      canOnlyManageEvent: true,
    }));

    render(<Header />);
    expect(screen.getByTestId("header")).toHaveClass("header-organizer");
  });
});
