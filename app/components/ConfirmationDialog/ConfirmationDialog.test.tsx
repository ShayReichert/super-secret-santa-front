import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ConfirmationDialog from "./ConfirmationDialog";

describe("ConfirmationDialog Component", () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();
  const dialogText = "Es-tu sûr de vouloir supprimer cet élément ?";

  it("renders correctly", () => {
    render(<ConfirmationDialog text={dialogText} open={true} onClose={mockOnClose} onConfirm={mockOnConfirm} />);

    expect(screen.getByText(dialogText)).toBeInTheDocument();
  });

  it("calls onConfirm when 'OUI' is clicked", () => {
    render(<ConfirmationDialog text={dialogText} open={true} onClose={mockOnClose} onConfirm={mockOnConfirm} />);

    fireEvent.click(screen.getByText("OUI"));
    expect(mockOnConfirm).toHaveBeenCalled();
  });

  it("calls onClose when 'ANNULER' is clicked", () => {
    render(<ConfirmationDialog text={dialogText} open={true} onClose={mockOnClose} onConfirm={mockOnConfirm} />);

    fireEvent.click(screen.getByText("ANNULER"));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
