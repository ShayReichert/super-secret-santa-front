import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateUserDialog from "./CreateUserDialog";
import { isValidEmail, isPasswordComplex } from "@/app/services/inputValidator";

jest.mock("../../../services/inputValidator.ts", () => ({
  isValidEmail: jest.fn(),
  isPasswordComplex: jest.fn(),
}));

describe("<CreateUserDialog />", () => {
  const onCloseMock = jest.fn();
  const onConfirmMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders when open and does not render when closed", () => {
    render(<CreateUserDialog open={true} onClose={onCloseMock} onConfirm={onConfirmMock} />);
    expect(screen.getByText("Créer un nouveau / nouvelle participant·e")).toBeInTheDocument();
  });

  it("closes when the 'Annuler' button is clicked", async () => {
    render(<CreateUserDialog open={true} onClose={onCloseMock} onConfirm={onConfirmMock} />);

    fireEvent.click(screen.getByText("Annuler"));

    // Attendre que onCloseMock soit appelé
    await waitFor(() => expect(onCloseMock).toHaveBeenCalledTimes(1));
  });

  it("updates input fields on user input", () => {
    render(<CreateUserDialog open={true} onClose={onCloseMock} onConfirm={onConfirmMock} />);

    fireEvent.change(screen.getByLabelText("Prénom"), { target: { value: "Alice" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "alice@example.com" } });
    fireEvent.change(screen.getByLabelText("Mot de passe"), { target: { value: "password123" } });

    expect((screen.getByLabelText("Prénom") as HTMLInputElement).value).toBe("Alice");
    expect((screen.getByLabelText("Email") as HTMLInputElement).value).toBe("alice@example.com");
    expect((screen.getByLabelText("Mot de passe") as HTMLInputElement).value).toBe("password123");
  });

  it("validates inputs and shows error messages", () => {
    (isValidEmail as jest.Mock).mockImplementation(() => false);
    (isPasswordComplex as jest.Mock).mockImplementation(() => false);

    render(<CreateUserDialog open={true} onClose={onCloseMock} onConfirm={onConfirmMock} />);

    fireEvent.change(screen.getByLabelText("Prénom"), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "invalidemail" } });
    fireEvent.change(screen.getByLabelText("Mot de passe"), { target: { value: "short" } });

    fireEvent.click(screen.getByText("Créer"));

    expect(screen.getByText("Le prénom ne peut pas être vide.")).toBeInTheDocument();
    expect(screen.getByText("Le format de l'email n'est pas valide.")).toBeInTheDocument();
    expect(screen.getByText("Le mot de passe doit faire au moins 8 caractères de chiffres ET de lettres.")).toBeInTheDocument();
  });

  it("calls onConfirm with correct data when form is valid", () => {
    (isValidEmail as jest.Mock).mockImplementation(() => true);
    (isPasswordComplex as jest.Mock).mockImplementation(() => true);

    render(<CreateUserDialog open={true} onClose={onCloseMock} onConfirm={onConfirmMock} />);

    fireEvent.change(screen.getByLabelText("Prénom"), { target: { value: "Alice" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "alice@example.com" } });
    fireEvent.change(screen.getByLabelText("Mot de passe"), { target: { value: "password123" } });

    fireEvent.click(screen.getByText("Créer"));

    expect(onConfirmMock).toHaveBeenCalledWith({
      username: "Alice",
      email: "alice@example.com",
      password: "password123",
    });
  });
});
