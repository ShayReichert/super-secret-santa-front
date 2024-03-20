import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AdminUserItem from "./AdminUserItem";

describe("<AdminUserItem />", () => {
  const user = { id: 1, username: "Alice", email: "alice@example.com", roles: ["ROLE_USER"] };
  const organizer = null; // Alice n'est pas l'organisatrice
  const onEditMock = jest.fn();
  const onDeleteMock = jest.fn();
  const onRemoveMock = jest.fn();
  const onEditSubmitMock = jest.fn();
  const updateUserMock = jest.fn();
  const onSetOrganizerMock = jest.fn();

  const renderAdminUserItem = () =>
    render(
      <table>
        <tbody>
          <AdminUserItem
            user={user}
            organizer={organizer}
            index={0}
            onEdit={onEditMock}
            onDelete={onDeleteMock}
            onRemove={onRemoveMock}
            onEditSubmit={onEditSubmitMock}
            updateUser={updateUserMock}
            isAdministrator={true}
            onSetOrganizer={onSetOrganizerMock}
          />
        </tbody>
      </table>
    );

  it("display user information correctly", () => {
    renderAdminUserItem();

    expect(screen.getByText(user.username)).toBeInTheDocument();
    expect(screen.getByText(user.email)).toBeInTheDocument();
  });

  it("opens the PasswordDialog when the user clicks on the password reset button", () => {
    renderAdminUserItem();

    const passwordResetButton = screen.getByLabelText("Réinitialiser le mot de passe");
    fireEvent.click(passwordResetButton);

    expect(screen.getByText("Réinitialiser le mot de passe")).toBeInTheDocument();
  });

  it("opens the OrganizerDialog when the user clicks on the organizer role button", () => {
    renderAdminUserItem();

    const organizerRoleButton = screen.getByLabelText("Attribuer le rôle d'organisateur");
    fireEvent.click(organizerRoleButton);

    expect(screen.getByText("Veux-tu vraiment attribuer la gestion de l'évènement à Alice ?")).toBeInTheDocument();
  });

  it("switches to edit mode when the user clicks on the Edit button", () => {
    renderAdminUserItem();

    const editButton = screen.getByLabelText("Modifier");
    fireEvent.click(editButton);

    const nameInput = screen.getByDisplayValue(user.username);
    const emailInput = screen.getByDisplayValue(user.email);

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
  });

  it("calls onEditSubmit with the correct values after submitting the modifications", () => {
    renderAdminUserItem();

    // Activer le mode édition
    const editButton = screen.getByLabelText("Modifier");
    fireEvent.click(editButton);

    // Modifier le nom et l'email
    const nameInput = screen.getByDisplayValue(user.username);
    const emailInput = screen.getByDisplayValue(user.email);
    fireEvent.change(nameInput, { target: { value: "AliceUpdated" } });
    fireEvent.change(emailInput, { target: { value: "aliceupdated@example.com" } });

    // Soumettre les modifications, par exemple en simulant un appui sur la touche "Entrée"
    fireEvent.keyDown(nameInput, { key: "Enter" });

    // Vérifier que onEditSubmit a été appelée avec les nouvelles valeurs
    expect(onEditSubmitMock).toHaveBeenCalledWith(0, "AliceUpdated", "aliceupdated@example.com");
  });

  it("calls onRemove with the correct index when the remove button is clicked", () => {
    renderAdminUserItem();

    // Simuler un clic sur le bouton de retrait de l'événement
    const removeButton = screen.getByLabelText("Retirer de l'évènement");
    fireEvent.click(removeButton);

    // Vérifier que onRemove a été appelée avec l'index correct (0 dans cet exemple)
    expect(onRemoveMock).toHaveBeenCalledWith(0);
  });

  it("calls onDelete with the correct index when the delete button is clicked", () => {
    renderAdminUserItem();

    // Simuler un clic sur le bouton de suppression
    const deleteButton = screen.getByLabelText("Supprimer");
    fireEvent.click(deleteButton);

    // Vérifier que onDelete a été appelée avec l'index correct (0 dans cet exemple)
    expect(onDeleteMock).toHaveBeenCalledWith(0);
  });
});
