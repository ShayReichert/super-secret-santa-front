import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axiosInstance from "@/app/services/axiosInstance";
import AdminUserList from "../../admin/components/AdminUserList/AdminUserList";

jest.mock("../services/axiosInstance.ts");

describe("AdminUserList Component", () => {
  beforeEach(() => {
    axiosInstance.get = jest.fn().mockResolvedValue({
      data: [{ username: "user1", email: "user1@example.com" }],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("displays users fetched from useUserList", async () => {
    render(<AdminUserList />);

    await waitFor(() => {
      expect(screen.getByText("user1")).toBeInTheDocument();
      expect(screen.getByText("user1@example.com")).toBeInTheDocument();
    });
  });

  it("adds a new user", async () => {
    axiosInstance.post = jest.fn().mockResolvedValue({
      data: { username: "newuser", email: "newuser@example.com" },
    });

    render(<AdminUserList />);

    fireEvent.change(screen.getByPlaceholderText("Prénom"), { target: { value: "newuser" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "newuser@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Code secret"), { target: { value: "password1" } });
    fireEvent.click(screen.getByText("AJOUTER"));

    await waitFor(() => {
      expect(screen.getByText("newuser")).toBeInTheDocument();
      expect(screen.getByText("newuser@example.com")).toBeInTheDocument();
    });
  });

  it("updates an existing user", async () => {
    // Mock the initial GET request to fetch users
    axiosInstance.get = jest.fn().mockResolvedValue({
      data: [{ username: "user1", email: "user1@example.com" }],
    });

    // Mock the PUT request for updating a user
    axiosInstance.put = jest.fn().mockResolvedValue(true);

    render(<AdminUserList />);

    // Wait for the initial users to be displayed
    await waitFor(() => {
      expect(screen.getByText("user1")).toBeInTheDocument();
    });

    // Simulate the click on the edit button for a specific user
    fireEvent.click(screen.getAllByLabelText("Modifier")[0]);

    // Simulate changing the values and submitting the form
    const usernameInput = screen.getByDisplayValue("user1");
    const emailInput = screen.getByDisplayValue("user1@example.com");
    fireEvent.change(usernameInput, { target: { value: "updatedUser" } });
    fireEvent.change(emailInput, { target: { value: "updatedUser@example.com" } });

    // Simulate pressing the "Enter" key
    fireEvent.keyDown(emailInput, { key: "Enter", code: "Enter" });

    // Check that the PUT request was called with the correct data
    await waitFor(() => {
      expect(axiosInstance.put).toHaveBeenCalledTimes(1);
      expect(axiosInstance.put).toHaveBeenCalledWith(`/api/admin/user/user1`, { username: "updatedUser", email: "updatedUser@example.com" });
    });

    // Verify that the UI is updated accordingly
    expect(screen.getByText("updatedUser")).toBeInTheDocument();
    expect(screen.getByText("updatedUser@example.com")).toBeInTheDocument();
  });

  it("deletes an existing user", async () => {
    // Mock the initial GET request to fetch users
    axiosInstance.get = jest.fn().mockResolvedValue({
      data: [{ username: "user1", email: "user1@example.com" }],
    });

    // Mock the DELETE request for deleting a user
    axiosInstance.delete = jest.fn().mockResolvedValue(true);

    render(<AdminUserList />);

    // Wait for the initial users to be displayed
    await waitFor(() => {
      expect(screen.getByText("user1")).toBeInTheDocument();
    });

    // Simulate the click on the delete button for a specific user
    fireEvent.click(screen.getAllByLabelText("Supprimer")[0]);

    const confirmButton = screen.getByText("OUI, SUPPRIMER");
    fireEvent.click(confirmButton);

    // Check that the DELETE request was called with the correct endpoint
    await waitFor(() => {
      expect(axiosInstance.delete).toHaveBeenCalledTimes(1);
      expect(axiosInstance.delete).toHaveBeenCalledWith(`/api/admin/user/user1`);
    });

    // Check that "user1" is no longer in the DOM
    await waitFor(() => {
      expect(screen.queryByText("user1")).not.toBeInTheDocument();
    });
  });
});
