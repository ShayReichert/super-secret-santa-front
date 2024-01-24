import React from "react";
import { render, screen } from "@testing-library/react";
import GifteeDetails from "./GifteeDetails";
import { UserProvider } from "../../../context/UserContext";
import Loader from "@/app/components/Loader/Loader";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("<GifteeDetails />", () => {
  it("renders correctly when loading", () => {
    render(
      <UserProvider>
        {/* <GifteeDetails /> */}
        <Loader />
      </UserProvider>
    );
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("renders user details when loaded", () => {
    render(
      <UserProvider>
        <GifteeDetails />
      </UserProvider>
    );
    // Supposons que "SantaOf" et "SantaOfGiftsLists" sont des données que vous attendez
    expect(screen.getByText(/Tu es le père Noël de/i)).toBeInTheDocument();
    expect(screen.getByText(/Voici les cadeaux qui lui feraient plaisir/i)).toBeInTheDocument();
  });

  // Ajoutez d'autres cas de test selon vos besoins
});
