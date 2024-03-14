import { render, fireEvent, waitFor } from "@testing-library/react";
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
    const { getByTestId, queryByRole } = render(<Menu />);
    const button = getByTestId("menu-button");

    expect(queryByRole("menu")).not.toBeInTheDocument();
    fireEvent.click(button);

    expect(queryByRole("menu")).toBeInTheDocument();
  });

  it("opens the NewEventDialog when 'Create New Event' is clicked", () => {
    const { getByText, getByTestId } = render(<Menu />);

    fireEvent.click(getByTestId("menu-button"));
    fireEvent.click(getByText("📆 Créer un nouvel événement"));

    expect(getByText("Créer un nouvel événement")).toBeInTheDocument();
  });

  it("renders user name correctly", () => {
    const { getByTestId } = render(<Menu />);

    expect(getByTestId("user-name")).toHaveTextContent("JohnDoe");
  });

  it("handles logout correctly", () => {
    const { getByTestId } = render(<Menu />);
    fireEvent.click(getByTestId("menu-button"));

    const logoutButton = getByTestId("logout-button");
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });

  it("changes style on admin pages", () => {
    (usePathname as jest.Mock).mockReturnValue("/admin");

    const { getByTestId } = render(<Menu isAdminPage={true} />);
    const userIcon = getByTestId("user-icon");

    expect(userIcon).toHaveClass("user-icon-admin");
  });
});
