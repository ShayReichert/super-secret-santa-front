import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useUserList } from "./useUserList";
import axiosInstance from "../../services/axiosInstance";

jest.mock("../../services/axiosInstance");

type UserListTestComponentProps = {
  onResult: (result: any) => void;
};

const UserListTestComponent = ({ onResult }: UserListTestComponentProps) => {
  const { getUsers, createUser, updateUser, deleteUser } = useUserList();

  return (
    <div>
      <button onClick={async () => onResult(await getUsers())}>Get Users</button>
      <button onClick={async () => onResult(await createUser({ username: "newUser", email: "newuser@example.com", password: "password123" }))}>
        Create User
      </button>
      <button onClick={async () => onResult(await updateUser(1, { username: "updatedUser", email: "updateduser@example.com" }))}>Update User</button>
      <button onClick={async () => onResult(await deleteUser(1))}>Delete User</button>
    </div>
  );
};

describe("useUserList hook", () => {
  it("getUsers returns a list of users on success", async () => {
    const mockUsers = [{ username: "user1", email: "user1@example.com" }];
    axiosInstance.get = jest.fn().mockResolvedValue({ data: mockUsers });

    const mockOnResult = jest.fn();
    render(<UserListTestComponent onResult={mockOnResult} />);

    fireEvent.click(screen.getByText("Get Users"));
    await waitFor(() => expect(mockOnResult).toHaveBeenCalledWith(mockUsers));
  });

  it("createUser returns a new user on success", async () => {
    const newUser = { username: "newUser", email: "newuser@example.com" };
    axiosInstance.post = jest.fn().mockResolvedValue({ data: newUser });

    const mockOnResult = jest.fn();
    render(<UserListTestComponent onResult={mockOnResult} />);

    fireEvent.click(screen.getByText("Create User"));
    await waitFor(() => expect(mockOnResult).toHaveBeenCalledWith(newUser));
  });

  it("updateUser returns true on successful update", async () => {
    axiosInstance.put = jest.fn().mockResolvedValue({});
    const mockOnResult = jest.fn();
    render(<UserListTestComponent onResult={mockOnResult} />);

    // Remplacez "Update User" par le texte réel de votre bouton pour mettre à jour un utilisateur
    fireEvent.click(screen.getByText("Update User"));
    await waitFor(() => expect(mockOnResult).toHaveBeenCalledWith(true));
  });

  it("deleteUser returns true on successful deletion", async () => {
    axiosInstance.delete = jest.fn().mockResolvedValue({});
    const mockOnResult = jest.fn();
    render(<UserListTestComponent onResult={mockOnResult} />);

    // Remplacez "Delete User" par le texte réel de votre bouton pour supprimer un utilisateur
    fireEvent.click(screen.getByText("Delete User"));
    await waitFor(() => expect(mockOnResult).toHaveBeenCalledWith(true));
  });
});
