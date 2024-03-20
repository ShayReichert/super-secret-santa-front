import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import NewEventDialog from "./NewEventDialog";

describe("<NewEventDialog />", () => {
  const onCloseMock = jest.fn();
  const onConfirmMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the dialog when open", () => {
    render(<NewEventDialog open={true} onClose={onCloseMock} onConfirm={onConfirmMock} />);

    expect(screen.getByText("Créer un nouvel événement")).toBeInTheDocument();
    expect(screen.getByLabelText("Nom de l'événement")).toBeInTheDocument();
    expect(screen.getByText("Annuler")).toBeInTheDocument();
    expect(screen.getByText("Confirmer")).toBeInTheDocument();
  });

  it("shows an error when trying to confirm with an empty event name", () => {
    render(<NewEventDialog open={true} onClose={onCloseMock} onConfirm={onConfirmMock} />);

    fireEvent.click(screen.getByText("Confirmer"));

    expect(screen.getByText("Le nom de l'événement ne peut pas être vide.")).toBeInTheDocument();
    expect(onConfirmMock).not.toHaveBeenCalled();
  });

  it("calls onConfirm with the event name when valid", () => {
    const eventName = "Test Event";
    render(<NewEventDialog open={true} onClose={onCloseMock} onConfirm={onConfirmMock} />);

    fireEvent.change(screen.getByLabelText("Nom de l'événement"), { target: { value: eventName } });
    fireEvent.click(screen.getByText("Confirmer"));

    expect(onConfirmMock).toHaveBeenCalledWith(eventName);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
