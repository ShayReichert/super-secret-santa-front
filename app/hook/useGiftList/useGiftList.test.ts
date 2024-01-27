import { renderHook, act } from "@testing-library/react";
import { useGiftList } from "./useGiftList";
import axiosInstance from "../../services/axiosInstance";
import * as userContextHooks from "@/app/context/UserContext";

jest.mock("../../services/axiosInstance.ts");
jest.mock("../../context/UserContext");

describe("useGiftList hooks", () => {
  let setUserStateMock: jest.Mock<any, any, any>;
  let consoleErrorMock: jest.SpyInstance<void, [message?: any, ...optionalParams: any[]], any>;

  beforeEach(() => {
    setUserStateMock = jest.fn();
    consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});

    (userContextHooks.useUser as jest.Mock).mockImplementation(() => ({
      userState: {
        data: {
          gifts: [{ id: 1, name: "Cadeau existant" }],
        },
      },
      setUserState: setUserStateMock,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleErrorMock.mockRestore();
  });

  it("should add a gift and update state correctly", async () => {
    const newGift = { id: 2, name: "Nouveau cadeau" };
    axiosInstance.post = jest.fn().mockResolvedValue({ data: newGift });

    const { result } = renderHook(() => useGiftList());
    const initialState = {
      data: {
        gifts: [{ id: 1, name: "Cadeau existant" }],
      },
    };

    await act(async () => {
      await result.current.addGift("Nouveau cadeau");
    });

    const updateUserStateFunction = setUserStateMock.mock.calls[0][0];
    const newState = updateUserStateFunction(initialState);

    // Check new state is update correctly
    expect(newState.data.gifts).toContainEqual(newGift);
    expect(newState.data.gifts).toContainEqual({ id: 1, name: "Cadeau existant" });
  });

  it("should update a gift and update state correctly", async () => {
    axiosInstance.put = jest.fn().mockResolvedValue({});

    const updatedGift = { id: 1, name: "Cadeau modifié" };

    const { result } = renderHook(() => useGiftList());
    const initialState = {
      data: {
        gifts: [{ id: 1, name: "Cadeau existant" }],
      },
    };

    await act(async () => {
      await result.current.updateGift(1, "Cadeau modifié");
    });

    expect(axiosInstance.put).toHaveBeenCalledWith(`api/gifts/1`, { name: "Cadeau modifié" });

    const updateUserStateFunction = setUserStateMock.mock.calls[0][0];
    const newState = updateUserStateFunction(initialState);

    // Check new state is update correctly
    expect(newState.data.gifts).toContainEqual(updatedGift);
    expect(newState.data.gifts).toHaveLength(1);
  });

  it("should delete a gift and update state correctly", async () => {
    axiosInstance.delete = jest.fn().mockResolvedValue({});

    const { result } = renderHook(() => useGiftList());
    const initialState = {
      data: {
        gifts: [
          { id: 1, name: "Cadeau 1" },
          { id: 2, name: "Cadeau 2" },
        ],
      },
    };

    await act(async () => {
      await result.current.deleteGift(1);
    });

    expect(axiosInstance.delete).toHaveBeenCalledWith(`api/gifts/1`);

    const updateStateFunction = setUserStateMock.mock.calls[0][0];
    const newState = updateStateFunction(initialState);

    // Check new state is update correctly
    expect(newState.data.gifts).not.toContainEqual({ id: 1, name: "Cadeau 1" });
    expect(newState.data.gifts).toHaveLength(1);
  });
});

describe("Error handling in useGiftList", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});

  afterAll(() => {
    consoleErrorMock.mockRestore();
  });

  it("should handle errors in addGift", async () => {
    const error = new Error("Failed to add gift");
    axiosInstance.post = jest.fn().mockRejectedValue(error);
    const { result } = renderHook(() => useGiftList());

    await act(async () => {
      await result.current.addGift("Nouveau Cadeau");
    });

    expect(console.error).toHaveBeenCalledWith("Erreur lors de l'ajout d'un cadeau", error);
  });

  it("should handle errors in updateGift", async () => {
    const error = new Error("Failed to update gift");
    axiosInstance.put = jest.fn().mockRejectedValue(error);
    const { result } = renderHook(() => useGiftList());

    await act(async () => {
      await result.current.updateGift(1, "Cadeau Modifié");
    });

    expect(console.error).toHaveBeenCalledWith("Erreur lors de la mise à jour d'un cadeau", error);
  });

  it("should handle errors in deleteGift", async () => {
    const error = new Error("Failed to delete gift");
    axiosInstance.delete = jest.fn().mockRejectedValue(error);
    const { result } = renderHook(() => useGiftList());

    await act(async () => {
      await result.current.deleteGift(1);
    });

    expect(console.error).toHaveBeenCalledWith("Erreur lors de la suppression d'un cadeau", error);
  });
});
