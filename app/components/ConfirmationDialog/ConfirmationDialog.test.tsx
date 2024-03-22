import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ConfirmationDialog from "./ConfirmationDialog";

describe("ConfirmationDialog Component", () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();
  const dialogText = "Es-tu sûr de vouloir supprimer cet élément ?";

  it("renders correctly", () => {
    const { getByText } = render(<ConfirmationDialog text={dialogText} open={true} onClose={mockOnClose} onConfirm={mockOnConfirm} />);

    expect(getByText(dialogText)).toBeInTheDocument();
  });

  it("calls onConfirm when 'OUI' is clicked", () => {
    const { getByText } = render(<ConfirmationDialog text={dialogText} open={true} onClose={mockOnClose} onConfirm={mockOnConfirm} />);

    fireEvent.click(getByText("OUI"));
    expect(mockOnConfirm).toHaveBeenCalled();
  });

  it("calls onClose when 'ANNULER' is clicked", () => {
    const { getByText } = render(<ConfirmationDialog text={dialogText} open={true} onClose={mockOnClose} onConfirm={mockOnConfirm} />);

    fireEvent.click(getByText("ANNULER"));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
