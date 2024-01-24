import { render, act, waitFor } from "@testing-library/react";
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

    let getByText: (arg0: string) => any;
    act(() => {
      ({ getByText } = render(
        <UserProvider>
          <MockComponent />
        </UserProvider>
      ));
    });

    await waitFor(() => {
      expect(getByText("User data")).toBeInTheDocument();
    });
  });
});
