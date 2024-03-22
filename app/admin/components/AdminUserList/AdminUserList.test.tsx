import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AdminUserList from "./AdminUserList";
import { useUser } from "@/app/context/UserContext";
import { useUserList } from "@/app/hook/useUserList/useUserList";
import { useEvents } from "@/app/hook/useEvents/useEvents";

jest.mock("../../../context/UserContext");
jest.mock("../../../hook/useUserList/useUserList");
jest.mock("../../../hook/useEvents/useEvents");

describe("<AdminUserList />", () => {
  beforeEach(() => {
    // Mock des fonctions et états retournés par vos hooks personnalisés

    (useUser as jest.Mock).mockReturnValue({
      userState: {
        /* ... */
      },
      currentEvent: {
        /* ... */
      },
      currentEventId: 1,
      isAdministrator: true,
    });

    (useUserList as jest.Mock).mockReturnValue({
      createUser: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    });

    (useEvents as jest.Mock).mockReturnValue({
      getCurrentEvent: jest.fn(() => Promise.resolve({ users: [], organizer: {} })),
      setOrganizerOfEvent: jest.fn(),
      setUserToEvent: jest.fn(),
      deleteEvent: jest.fn(),
      removeUserToEvent: jest.fn(),
      renameEvent: jest.fn(),
    });
  });

  it("affiche correctement les utilisateurs après le chargement des données", async () => {
    const mockUsers = [
      { id: 1, username: "Alice", email: "alice@example.com" },
      { id: 2, username: "Bob", email: "bob@example.com" },
    ];

    (useEvents as jest.Mock).mockReturnValue({
      getCurrentEvent: jest.fn(() => Promise.resolve({ users: mockUsers, organizer: {} })),
    });

    render(<AdminUserList />);

    // Attendre que les données des utilisateurs soient chargées et affichées
    for (const user of mockUsers) {
      await screen.findByText(user.username);
      await screen.findByText(user.email);
    }
  });
});
