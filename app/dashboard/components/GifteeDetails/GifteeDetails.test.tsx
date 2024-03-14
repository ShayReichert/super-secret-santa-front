import React from "react";
import { render, screen } from "@testing-library/react";
import GifteeDetails from "./GifteeDetails";
import * as UserContext from "@/app/context/UserContext";

jest.mock("../../../context/UserContext.tsx", () => ({
  useUser: jest.fn(),
}));

describe("<GifteeDetails />", () => {
  it("renders a loader when user data is loading", () => {
    (UserContext.useUser as any).mockImplementation(() => ({
      userState: { loading: true },
      currentEvent: null,
    }));

    render(<GifteeDetails />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("renders a message when no event is selected", () => {
    (UserContext.useUser as any).mockImplementation(() => ({
      userState: { loading: false },
      currentEvent: null,
    }));

    render(<GifteeDetails />);
    expect(screen.getByText("Aucun événement sélectionné (ou l'événement n'existe pas).")).toBeInTheDocument();
  });

  it("renders giftee details and their wishlist when loaded", () => {
    (UserContext.useUser as any).mockImplementation(() => ({
      userState: { loading: false },
      currentEvent: {
        id: 1,
        santaOf: "Nom du destinataire",
        santaOfGiftList: {
          gifts: [
            { id: 1, name: "Cadeau 1" },
            { id: 2, name: "Cadeau 2" },
          ],
        },
      },
    }));

    render(<GifteeDetails />);
    expect(screen.getByText(/Tu es le Père Noël de/i)).toBeInTheDocument();
    expect(screen.getByText("Nom du destinataire")).toBeInTheDocument();
    expect(screen.getByText(/Voici les cadeaux qui lui feraient plaisir/i)).toBeInTheDocument();
    expect(screen.getByText(/Cadeau 1/)).toBeInTheDocument();
    expect(screen.getByText(/Cadeau 2/)).toBeInTheDocument();
  });
});
