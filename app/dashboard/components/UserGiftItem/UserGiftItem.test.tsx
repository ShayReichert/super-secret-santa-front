import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import UserGiftItem from "./UserGiftItem";

const mockGift = {
  id: 1,
  name: "Chouette carnet",
  isEditing: false,
  editingText: "Chouette carnet",
};

const TestWrapper = ({ gift }: { gift: UserGift }) => {
  const [testGift, setTestGift] = useState(gift);

  const mockOnEdit = (giftId: number, text: string) => {
    setTestGift({ ...testGift, isEditing: true, editingText: text });
  };

  const mockOnDelete = jest.fn();
  const mockOnEditSubmit = jest.fn(() => setTestGift({ ...testGift, isEditing: false }));

  return <UserGiftItem gift={testGift} onEdit={mockOnEdit} onDelete={mockOnDelete} onEditSubmit={mockOnEditSubmit} />;
};

describe("<UserGiftItem />", () => {
  beforeEach(() => {
    render(<TestWrapper gift={mockGift} />);
  });

  it("renders gift item correctly", () => {
    expect(screen.getByText(mockGift.name)).toBeInTheDocument();
    expect(screen.getByLabelText("Modifier")).toBeInTheDocument();
    expect(screen.getByLabelText("Supprimer")).toBeInTheDocument();
  });

  it("enters edit mode on edit button click", () => {
    fireEvent.click(screen.getByLabelText("Modifier"));
    expect(screen.getByDisplayValue(mockGift.editingText)).toBeInTheDocument();
  });

  it("calls onEditSubmit on enter key press", () => {
    fireEvent.click(screen.getByLabelText("Modifier"));
    const input = screen.getByDisplayValue(mockGift.editingText);
    fireEvent.keyDown(input, { key: "Enter" });
    expect(input).not.toBeInTheDocument();
  });

  it("calls onDelete on delete button click", () => {
    const deleteButton = screen.getByLabelText("Supprimer");
    fireEvent.click(deleteButton);
    expect(deleteButton).toBeInTheDocument();
  });
});
