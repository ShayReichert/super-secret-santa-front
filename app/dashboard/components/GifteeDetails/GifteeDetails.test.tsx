import React from "react";
import { render, screen } from "@testing-library/react";
import GifteeDetails from "./GifteeDetails";
import { UserProvider } from "../../../context/UserContext";
import Loader from "@/app/components/Loader/Loader";
import * as userContextHooks from "@/app/context/UserContext";

jest.mock("../../../context/UserContext.tsx");

beforeEach(() => {
  jest.clearAllMocks();

  (userContextHooks.useUser as jest.Mock).mockImplementation(() => ({
    userState: {
      loading: false,
      data: {
        events: [
          {
            id: 1,
            santaOf: "Nom du destinataire",
            santaOfGiftList: {
              gifts: [
                { id: 1, name: "Cadeau 1" },
                { id: 2, name: "Cadeau 2" },
              ],
            },
          },
        ],
      },
    },
    currentEventId: 1,
  }));
});

describe("<GifteeDetails />", () => {
  it("renders correctly when loading", () => {
    render(<Loader />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("renders user details when loaded", () => {
    render(<GifteeDetails />);
    expect(screen.getByText(/Tu es le père Noël de/i)).toBeInTheDocument();
    expect(screen.getByText(/Nom du destinataire/i)).toBeInTheDocument();
    expect(screen.getByText(/Voici les cadeaux qui lui feraient plaisir/i)).toBeInTheDocument();
    expect(screen.getByText(/Cadeau 1/i)).toBeInTheDocument();
  });
});
