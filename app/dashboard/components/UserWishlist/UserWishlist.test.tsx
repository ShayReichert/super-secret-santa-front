import { act, render, screen, fireEvent } from "@testing-library/react";
import UserWishlist from "./UserWishlist";
import * as giftListHooks from "@/app/hook/useGiftList/useGiftList";
import * as userContextHooks from "@/app/context/UserContext";

jest.mock("../../../hook/useGiftList/useGiftList.ts");
jest.mock("../../../context/UserContext.tsx");

const mockGifts = [
  { id: 1, name: "Cadeau 1" },
  { id: 2, name: "Cadeau 2" },
];

const mockEvents = [{ id: 1, giftList: { id: 1, gifts: mockGifts } }];

const addGiftMock = jest.fn();
const updateGiftMock = jest.fn();
const deleteGiftMock = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  (userContextHooks.useUser as jest.Mock).mockImplementation(() => ({
    userState: {
      loading: false,
      data: { events: mockEvents },
    },
    currentEventId: 1,
  }));

  (giftListHooks.useGiftList as jest.Mock).mockImplementation(() => ({
    addGift: addGiftMock,
    updateGift: updateGiftMock,
    deleteGift: deleteGiftMock,
  }));
});

describe("<UserWishlist /> with no event selected", () => {
  beforeEach(() => {
    // Simuler un état où aucun événement n'est sélectionné
    (userContextHooks.useUser as jest.Mock).mockImplementation(() => ({
      userState: {
        loading: false,
        data: { events: [] },
      },
      currentEventId: null,
    }));
  });

  it("shows no event selected message", () => {
    render(<UserWishlist />);
    expect(screen.getByText("Aucun événement sélectionné (ou l'événement n'existe pas).")).toBeInTheDocument();
  });
});

describe("<UserWishlist />", () => {
  it("renders correctly", () => {
    render(<UserWishlist />);
    expect(screen.getByText("Et toi, que voudrais-tu pour Noël ?")).toBeInTheDocument();
    expect(screen.getByText("AJOUTER")).toBeInTheDocument();
  });

  it("allows a new gift to be added", async () => {
    render(<UserWishlist />);
    const input = screen.getByPlaceholderText("Ajoute un cadeau");
    const addButton = screen.getByRole("button", { name: "AJOUTER" });

    await act(async () => {
      fireEvent.change(input, { target: { value: "Nouveau Cadeau" } });
      fireEvent.click(addButton);
    });

    expect(addGiftMock).toHaveBeenCalledWith("Nouveau Cadeau", 1);
  });

  it("allows a gift to be edited", async () => {
    render(<UserWishlist />);
    fireEvent.click(screen.getAllByLabelText("Modifier")[0]);
    const input = screen.getByDisplayValue(mockGifts[0].name);

    await act(async () => {
      fireEvent.change(input, { target: { value: "Cadeau Edité" } });
      fireEvent.keyDown(input, { key: "Enter" });
    });

    expect(updateGiftMock).toHaveBeenCalledWith(mockGifts[0].id, "Cadeau Edité", 1);
  });

  it("opens confirmation dialog on delete button click", async () => {
    render(<UserWishlist />);

    await act(async () => {
      fireEvent.click(screen.getAllByLabelText("Supprimer")[0]);
    });

    expect(screen.getByText("Es-tu sûr·e de vouloir supprimer ce cadeau ?")).toBeInTheDocument();
  });
});
