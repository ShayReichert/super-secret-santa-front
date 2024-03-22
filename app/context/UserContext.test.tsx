import { render, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { UserProvider, useUser } from "./UserContext";
import axiosInstance from "../services/axiosInstance";

jest.mock("../services/axiosInstance");

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const MockComponent = () => {
  const { userState } = useUser();
  return userState.loading ? <div>Loading</div> : <div>User data</div>;
};

describe("UserContext", () => {
  it("fetches and displays user data", async () => {
    axiosInstance.get = jest.fn().mockResolvedValue({
      data: {
        id: 1,
        name: "John Doe",
        email: "johndoe@example.com",
      },
    });

    render(
      <UserProvider>
        <MockComponent />
      </UserProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("User data")).toBeInTheDocument();
    });
  });
});
