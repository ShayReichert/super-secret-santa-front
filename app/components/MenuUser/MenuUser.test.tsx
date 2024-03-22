import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Menu from "./MenuUser";
import { usePathname } from "next/navigation";

const mockLogout = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: jest.fn().mockReturnValue("/"),
}));

jest.mock("../../hook/useAuth/useAuth.ts", () => ({
  useAuth: () => ({
    logout: mockLogout,
  }),
}));

jest.mock("../../context/UserContext.tsx", () => ({
  useUser: () => ({
    userState: {
      data: {
        userName: "JohnDoe",
      },
    },
  }),
}));

describe("Menu Component", () => {
  it("opens the menu correctly", async () => {
    render(<Menu />);
    const button = screen.getByTestId("menu-button");

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    fireEvent.click(button);

    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("opens the NewEventDialog when 'Create New Event' is clicked", () => {
    render(<Menu />);

    fireEvent.click(screen.getByTestId("menu-button"));
    fireEvent.click(screen.getByText("📆 Créer un nouvel événement"));

    expect(screen.getByText("Créer un nouvel événement")).toBeInTheDocument();
  });

  it("renders user name correctly", () => {
    render(<Menu />);

    expect(screen.getByTestId("user-name")).toHaveTextContent("JohnDoe");
  });

  it("handles logout correctly", () => {
    render(<Menu />);
    fireEvent.click(screen.getByTestId("menu-button"));

    const logoutButton = screen.getByTestId("logout-button");
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });

  it("changes style on admin pages", () => {
    (usePathname as jest.Mock).mockReturnValue("/admin");

    render(<Menu isAdminPage={true} />);
    const userIcon = screen.getByTestId("user-icon");

    expect(userIcon).toHaveClass("user-icon-admin");
  });
});
