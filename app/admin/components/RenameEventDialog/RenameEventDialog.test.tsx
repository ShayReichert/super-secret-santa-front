import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import RenameEventDialog from "./RenameEventDialog";

describe("<RenameEventDialog />", () => {
  const onCloseMock = jest.fn();
  const onConfirmMock = jest.fn();
  const currentEventName = "EventName";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes the dialog with the current event name", () => {
    render(<RenameEventDialog open={true} onClose={onCloseMock} onConfirm={onConfirmMock} currentEventName={currentEventName} />);

    expect((screen.getByLabelText("Nouveau nom de l'événement") as HTMLInputElement).value).toBe(currentEventName);
  });

  it("shows an error when trying to confirm with an empty event name", () => {
    render(<RenameEventDialog open={true} onClose={onCloseMock} onConfirm={onConfirmMock} currentEventName={currentEventName} />);

    fireEvent.change(screen.getByLabelText("Nouveau nom de l'événement"), { target: { value: "" } });
    fireEvent.click(screen.getByText("Confirmer"));

    expect(screen.getByText("Le nom de l'événement ne peut pas être vide.")).toBeInTheDocument();
    expect(onConfirmMock).not.toHaveBeenCalled();
  });

  it("shows an error when the new name is the same as the current name", () => {
    render(<RenameEventDialog open={true} onClose={onCloseMock} onConfirm={onConfirmMock} currentEventName={currentEventName} />);

    fireEvent.change(screen.getByLabelText("Nouveau nom de l'événement"), { target: { value: currentEventName } });
    fireEvent.click(screen.getByText("Confirmer"));

    expect(screen.getByText("Le nouveau nom de l'événement doit être différent de l'actuel.")).toBeInTheDocument();
    expect(onConfirmMock).not.toHaveBeenCalled();
  });

  it("calls onConfirm with the new event name when valid", () => {
    const newEventName = "NewEventName";
    render(<RenameEventDialog open={true} onClose={onCloseMock} onConfirm={onConfirmMock} currentEventName={currentEventName} />);

    fireEvent.change(screen.getByLabelText("Nouveau nom de l'événement"), { target: { value: newEventName } });
    fireEvent.click(screen.getByText("Confirmer"));

    expect(onConfirmMock).toHaveBeenCalledWith(newEventName);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
