import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Menu from "./Menu";
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
  it("renders user name correctly", () => {
    const { getByTestId } = render(<Menu />);
    expect(getByTestId("user-name")).toHaveTextContent("JohnDoe");
  });

  it("handles logout correctly", () => {
    const { getByTestId } = render(<Menu />);
    const logoutButton = getByTestId("logout-button");
    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalled();
  });

  it("changes style on admin pages", () => {
    (usePathname as jest.Mock).mockReturnValue("/admin");

    const { getByTestId } = render(<Menu />);
    const userIcon = getByTestId("user-icon");

    expect(userIcon).toHaveClass("user-icon-admin");
  });
});
