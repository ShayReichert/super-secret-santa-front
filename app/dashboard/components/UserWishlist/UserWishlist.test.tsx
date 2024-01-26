import { act, render, screen, fireEvent } from "@testing-library/react";
import UserWishlist from "./UserWishlist";
import * as giftListHooks from "@/app/hook/useGiftList";
import * as userContextHooks from "@/app/context/UserContext";

jest.mock("../../../hook/useGiftList.ts");
jest.mock("../../../context/UserContext.tsx");

const mockGifts = [
  { id: 1, name: "Cadeau 1" },
  { id: 2, name: "Cadeau 2" },
];

const addGiftMock = jest.fn();
const updateGiftMock = jest.fn();
const deleteGiftMock = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  (userContextHooks.useUser as jest.Mock).mockImplementation(() => ({
    userState: {
      loading: false,
      data: { gifts: mockGifts },
    },
  }));

  (giftListHooks.useGiftList as jest.Mock).mockImplementation(() => ({
    addGift: addGiftMock,
    updateGift: updateGiftMock,
    deleteGift: deleteGiftMock,
  }));
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

    expect(addGiftMock).toHaveBeenCalledWith("Nouveau Cadeau");
  });

  it("allows a gift to be edited", async () => {
    render(<UserWishlist />);
    fireEvent.click(screen.getAllByLabelText("Modifier")[0]);
    const input = screen.getByDisplayValue(mockGifts[0].name);

    await act(async () => {
      fireEvent.change(input, { target: { value: "Cadeau Edité" } });
      fireEvent.keyDown(input, { key: "Enter" });
    });

    expect(updateGiftMock).toHaveBeenCalledWith(mockGifts[0].id, "Cadeau Edité");
  });

  it("opens confirmation dialog on delete button click", async () => {
    render(<UserWishlist />);

    await act(async () => {
      fireEvent.click(screen.getAllByLabelText("Supprimer")[0]);
    });

    expect(screen.getByText("Es-tu sûr·e de vouloir supprimer ce cadeau ?")).toBeInTheDocument();
  });
});
