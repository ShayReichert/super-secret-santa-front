import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AdminGuard from "./AdminGuard";
import { useUser } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";

jest.mock("../../../context/UserContext.tsx", () => ({
  useUser: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("<AdminGuard />", () => {
  it("redirects unauthorized users", async () => {
    (useUser as jest.Mock).mockReturnValue({
      userState: {
        loading: false,
        data: { roles: ["ROLE_USER"] }, // Utilisateur non-admin et non-organisateur
      },
    });

    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: pushMock,
    }));

    render(
      <AdminGuard>
        <div>Contenu protégé</div>
      </AdminGuard>
    );

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("display content for authorized users", () => {
    (useUser as jest.Mock).mockReturnValue({
      userState: {
        loading: false,
        data: { roles: ["ROLE_ADMIN"] }, // Utilisateur admin
      },
    });

    render(
      <AdminGuard>
        <div>Contenu protégé</div>
      </AdminGuard>
    );

    expect(screen.getByText("Contenu protégé")).toBeInTheDocument();
  });

  it("display loader while user state is loading", () => {
    (useUser as jest.Mock).mockReturnValue({
      userState: {
        loading: true, // L'état de chargement
        data: null,
      },
    });

    render(
      <AdminGuard>
        <div>Contenu protégé</div>
      </AdminGuard>
    );

    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });
});
