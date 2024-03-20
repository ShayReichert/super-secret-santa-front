import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PasswordDialog from "./PasswordDialog";
import { isPasswordComplex } from "@/app/services/inputValidator";

jest.mock("../../../services/inputValidator");

describe("<PasswordDialog />", () => {
  const onCloseMock = jest.fn();
  const onConfirmMock = jest.fn();
  const isPasswordComplexMock = isPasswordComplex as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    isPasswordComplexMock.mockClear();
  });

  it("renders the dialog when open", () => {
    render(<PasswordDialog open={true} onClose={onCloseMock} onConfirm={onConfirmMock} />);

    expect(screen.getByText("Réinitialiser le mot de passe")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nouveau mot de passed")).toBeInTheDocument();
    expect(screen.getByText("Annuler")).toBeInTheDocument();
    expect(screen.getByText("Confirmer")).toBeInTheDocument();
  });

  it("displays an error when trying to confirm with an empty password", () => {
    render(<PasswordDialog open={true} onClose={onCloseMock} onConfirm={onConfirmMock} />);

    fireEvent.click(screen.getByText("Confirmer"));

    expect(screen.getByText("Le mot de passe ne peut pas être vide.")).toBeInTheDocument();
    expect(onConfirmMock).not.toHaveBeenCalled();
  });

  it("displays an error for a non-complex password", () => {
    (isPasswordComplex as jest.Mock).mockReturnValue(false);

    render(<PasswordDialog open={true} onClose={onCloseMock} onConfirm={onConfirmMock} />);
    fireEvent.change(screen.getByPlaceholderText("Nouveau mot de passed"), { target: { value: "12345" } });
    fireEvent.click(screen.getByText("Confirmer"));

    expect(screen.getByText("Le mot de passe doit faire au moins 8 caractères de chiffres ET de lettres.")).toBeInTheDocument();
    expect(onConfirmMock).not.toHaveBeenCalled();
  });

  it("calls onConfirm with the new password for a complex password", () => {
    (isPasswordComplex as jest.Mock).mockReturnValue(true);

    render(<PasswordDialog open={true} onClose={onCloseMock} onConfirm={onConfirmMock} />);
    fireEvent.change(screen.getByPlaceholderText("Nouveau mot de passed"), { target: { value: "Password123" } });
    fireEvent.click(screen.getByText("Confirmer"));

    expect(onConfirmMock).toHaveBeenCalledWith("Password123");
  });
});
