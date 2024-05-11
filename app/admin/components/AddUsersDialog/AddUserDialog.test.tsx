// TODO : refacto par rapport aux modifs de AddUsersDialog.tsx

import { act, render, screen, fireEvent } from "@testing-library/react";
import AddUsersDialog from "./AddUsersDialog";
import * as userContextHooks from "@/app/context/UserContext";
import * as eventHooks from "@/app/hook/useEvents/useEvents";
import * as eventsFilter from "@/app/services/eventsFilter";

jest.mock("../../../context/UserContext");
jest.mock("../../../hook/useEvents/useEvents");
jest.mock("../../../services/eventsFilter");

const mockUsers = [
  { id: 1, username: "Utilisateur1" },
  { id: 2, username: "Utilisateur2" },
];

const mockEvents = [{ id: 1, name: "Évènement1" }];

beforeEach(() => {
  jest.clearAllMocks();

  (userContextHooks.useUser as jest.Mock).mockImplementation(() => ({
    userState: { data: { organizedEventIds: [1], events: mockEvents } },
    isAdministrator: true,
    currentEventId: 1,
  }));

  (eventHooks.useEvents as jest.Mock).mockImplementation(() => ({
    getEvents: jest.fn(() => Promise.resolve(mockEvents)),
  }));

  (eventsFilter.extractUsers as jest.Mock).mockImplementation(() => mockUsers);
});

describe("<AddUsersDialog /> with users available for selection", () => {
  it("renders correctly and displays users after selecting", async () => {
    render(<AddUsersDialog open={true} onClose={() => {}} onConfirm={() => {}} />);

    // Vérifier que le composant est en chargement initialement
    expect(screen.getByText("Chargement...")).toBeInTheDocument();

    // Attendre que le composant soit chargé
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Simuler un clic pour ouvrir le Select
    const select = screen.getByRole("combobox", { name: /Participant·es/i });
    fireEvent.mouseDown(select);

    // Attendre que les options soient visibles
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Vérifier que les options sont présentes
    expect(screen.getByText("Utilisateur1")).toBeInTheDocument();
    expect(screen.getByText("Utilisateur2")).toBeInTheDocument();
  });

  it("handles user selection and triggers confirmation", async () => {
    const onConfirmMock = jest.fn();
    render(<AddUsersDialog open={true} onClose={() => {}} onConfirm={onConfirmMock} />);

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    // Simuler la sélection d'un utilisateur
    fireEvent.mouseDown(screen.getByLabelText("Participant·es"));
    fireEvent.click(screen.getByText("Utilisateur1"));

    // Simuler le clic sur le bouton de confirmation
    fireEvent.click(screen.getByText("Ajouter"));

    expect(onConfirmMock).toHaveBeenCalledWith([1]); // L'ID de l'utilisateur sélectionné
  });
});

describe("<AddUsersDialog /> with no users available", () => {
  beforeEach(() => {
    // Simuler un scénario où aucun utilisateur n'est disponible pour la sélection
    (eventsFilter.extractUsers as jest.Mock).mockImplementation(() => []);
  });

  it("displays no users available message", async () => {
    render(<AddUsersDialog open={true} onClose={() => {}} onConfirm={() => {}} />);

    // Attendre que le message de non-disponibilité soit affiché
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(screen.getByText("Aucun participant déjà existant ne peut être ajouté à cet évènement !")).toBeInTheDocument();
  });
});
