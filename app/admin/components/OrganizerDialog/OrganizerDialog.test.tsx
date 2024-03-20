import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import OrganizerDialog from "./OrganizerDialog";

describe("<OrganizerDialog />", () => {
  const onCloseMock = jest.fn();
  const onConfirmMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly for an administrator", () => {
    render(<OrganizerDialog open={true} onClose={onCloseMock} onConfirm={onConfirmMock} userName="Alice" isAdministrator={true} />);

    expect(screen.getByText("Attention")).toBeInTheDocument();
    expect(screen.getByText("Veux-tu vraiment attribuer la gestion de l'évènement à Alice ?")).toBeInTheDocument();
    expect(screen.getByText("Annuler")).toBeInTheDocument();
    expect(screen.getByText("Confirmer")).toBeInTheDocument();
  });

  it("renders correctly for a non-administrator", () => {
    render(<OrganizerDialog open={true} onClose={onCloseMock} onConfirm={onConfirmMock} userName="Bob" isAdministrator={false} />);

    expect(screen.getByText("Attention")).toBeInTheDocument();
    expect(screen.getByText("Tu ne pourras plus gérer cet évènement si tu attribues la gestion à Bob. Veux-tu continuer ?")).toBeInTheDocument();
    expect(screen.getByText("Annuler")).toBeInTheDocument();
    expect(screen.getByText("Confirmer")).toBeInTheDocument();
  });

  it('calls onClose when the "Annuler" button is clicked', () => {
    render(<OrganizerDialog open={true} onClose={onCloseMock} onConfirm={onConfirmMock} userName="Alice" isAdministrator={true} />);

    fireEvent.click(screen.getByText("Annuler"));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm and then onClose when the "Confirmer" button is clicked', () => {
    render(<OrganizerDialog open={true} onClose={onCloseMock} onConfirm={onConfirmMock} userName="Alice" isAdministrator={true} />);

    fireEvent.click(screen.getByText("Confirmer"));
    expect(onConfirmMock).toHaveBeenCalledTimes(1);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
