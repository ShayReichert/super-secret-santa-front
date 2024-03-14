import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "./Header";
import * as AuthHook from "@/app/hook/useAuth/useAuth";
import * as NavigationHook from "next/navigation";
import * as UserContext from "@/app/context/UserContext";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("../../context/UserContext.tsx", () => ({
  useUser: jest.fn(),
}));

jest.mock("../../hook/useAuth/useAuth.ts", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../MenuUser/MenuUser", () => () => <div>MenuUser component</div>);
jest.mock("../MenuEvents/MenuEvents", () => () => <div>MenuEvents component</div>);

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

    const { container } = render(<Header />);
    expect(container.firstChild).toHaveClass("header-admin");
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

    const { container } = render(<Header />);
    expect(container.firstChild).toHaveClass("header-organizer");
  });
});
