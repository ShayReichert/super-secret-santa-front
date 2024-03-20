import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import MenuListAdmin from "./MenuListAdmin";

describe("<MenuListAdmin />", () => {
  const onRenameEventMock = jest.fn();
  const onDeleteEventMock = jest.fn();
  const onCreateUserMock = jest.fn();
  const onAddUsersMock = jest.fn();
  const onPerformDrawMock = jest.fn();
  const drawStateMock = { isLoading: false, error: "", successMessage: "" };

  it("open the menu when the button is clicked", () => {
    render(
      <MenuListAdmin
        onRenameEvent={onRenameEventMock}
        onDeleteEvent={onDeleteEventMock}
        onCreateUser={onCreateUserMock}
        onAddUsers={onAddUsersMock}
        onPerformDraw={onPerformDrawMock}
        drawState={drawStateMock}
      />
    );

    // Ouverture du menu
    const menuButton = screen.getByAltText("Menu admin");
    fireEvent.click(menuButton);
    expect(screen.getByText("Ajouter des participant·es")).toBeInTheDocument();
  });

  it("calls onAddUsers when 'Ajouter des participant·es' is clicked", () => {
    render(
      <MenuListAdmin
        onRenameEvent={onRenameEventMock}
        onDeleteEvent={onDeleteEventMock}
        onCreateUser={onCreateUserMock}
        onAddUsers={onAddUsersMock}
        onPerformDraw={onPerformDrawMock}
        drawState={drawStateMock}
      />
    );

    fireEvent.click(screen.getByAltText("Menu admin")); // Ouvre le menu
    fireEvent.click(screen.getByText("Ajouter des participant·es"));
    expect(onAddUsersMock).toHaveBeenCalled();
  });

  it("calls onCreateUser when 'Créer un·e nouvelle participant·e' is clicked", () => {
    render(
      <MenuListAdmin
        onRenameEvent={onRenameEventMock}
        onDeleteEvent={onDeleteEventMock}
        onCreateUser={onCreateUserMock}
        onAddUsers={onAddUsersMock}
        onPerformDraw={onPerformDrawMock}
        drawState={drawStateMock}
      />
    );

    fireEvent.click(screen.getByAltText("Menu admin")); // Ouvre le menu
    fireEvent.click(screen.getByText("Créer un·e nouvelle participant·e"));
    expect(onCreateUserMock).toHaveBeenCalled();
  });

  it("calls onRenameEvent when 'Modifier le nom de cet évènement' is clicked", () => {
    render(
      <MenuListAdmin
        onRenameEvent={onRenameEventMock}
        onDeleteEvent={onDeleteEventMock}
        onCreateUser={onCreateUserMock}
        onAddUsers={onAddUsersMock}
        onPerformDraw={onPerformDrawMock}
        drawState={drawStateMock}
      />
    );

    fireEvent.click(screen.getByAltText("Menu admin")); // Ouvre le menu
    fireEvent.click(screen.getByText("Modifier le nom de cet évènement"));
    expect(onRenameEventMock).toHaveBeenCalled();
  });

  it("calls onDeleteEvent when 'Supprimer cet évènement' is clicked", () => {
    render(
      <MenuListAdmin
        onRenameEvent={onRenameEventMock}
        onDeleteEvent={onDeleteEventMock}
        onCreateUser={onCreateUserMock}
        onAddUsers={onAddUsersMock}
        onPerformDraw={onPerformDrawMock}
        drawState={drawStateMock}
      />
    );

    fireEvent.click(screen.getByAltText("Menu admin")); // Ouvre le menu
    fireEvent.click(screen.getByText("Supprimer cet évènement"));
    expect(onDeleteEventMock).toHaveBeenCalled();
  });

  it("calls onPerformDraw when 'Faire le tirage au sort' is clicked and drawState allows it", () => {
    render(
      <MenuListAdmin
        onRenameEvent={onRenameEventMock}
        onDeleteEvent={onDeleteEventMock}
        onCreateUser={onCreateUserMock}
        onAddUsers={onAddUsersMock}
        onPerformDraw={onPerformDrawMock}
        drawState={{ isLoading: false, error: "", successMessage: "" }}
      />
    );

    fireEvent.click(screen.getByAltText("Menu admin")); // Ouvre le menu
    fireEvent.click(screen.getByText("Faire le tirage au sort"));
    expect(onPerformDrawMock).toHaveBeenCalled();
  });
  it("displays appropriate draw state messages", () => {
    const drawStateErrorMock = { isLoading: false, error: "Une erreur est survenue", successMessage: "" };
    render(
      <MenuListAdmin
        onRenameEvent={onRenameEventMock}
        onDeleteEvent={onDeleteEventMock}
        onCreateUser={onCreateUserMock}
        onAddUsers={onAddUsersMock}
        onPerformDraw={onPerformDrawMock}
        drawState={drawStateErrorMock}
      />
    );

    fireEvent.click(screen.getByAltText("Menu admin")); // Ouvre le menu
    expect(screen.getByText(`Erreur : ${drawStateErrorMock.error}`)).toBeInTheDocument();
  });

  it("display a loading message when drawState.isLoading is true", () => {
    render(
      <MenuListAdmin
        onRenameEvent={onRenameEventMock}
        onDeleteEvent={onDeleteEventMock}
        onCreateUser={onCreateUserMock}
        onAddUsers={onAddUsersMock}
        onPerformDraw={onPerformDrawMock}
        drawState={{ isLoading: true, error: "", successMessage: "" }}
      />
    );

    fireEvent.click(screen.getByAltText("Menu admin")); // Ouvre le menu
    expect(screen.getByText("Chargement...")).toBeInTheDocument();
  });

  it("display a success message when drawState.successMessage is not empty", () => {
    const successMessage = "Tirage effectué avec succès";
    render(
      <MenuListAdmin
        onRenameEvent={onRenameEventMock}
        onDeleteEvent={onDeleteEventMock}
        onCreateUser={onCreateUserMock}
        onAddUsers={onAddUsersMock}
        onPerformDraw={onPerformDrawMock}
        drawState={{ isLoading: false, error: "", successMessage: successMessage }}
      />
    );

    fireEvent.click(screen.getByAltText("Menu admin")); // Ouvre le menu
    expect(screen.getByText(successMessage + " !")).toBeInTheDocument();
  });
});
