import { act, renderHook } from "@testing-library/react";
import { useRouter } from "next/navigation";
import axiosInstance from "../../services/axiosInstance";
import { setCookie, deleteCookie, getCookie } from "cookies-next";
import { useAuth } from "./useAuth";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../../services/axiosInstance.ts", () => ({
  post: jest.fn().mockResolvedValue({
    data: {
      token: "mockToken",
    },
  }),
  get: jest.fn(),
}));

jest.mock("cookies-next", () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
  getCookie: jest.fn(),
}));

jest.mock("../../context/UserContext.tsx", () => ({
  useUser: () => ({
    userState: { data: null, loading: false, error: null },
    setUserState: jest.fn(),
  }),
}));

describe("useAuth", () => {
  let consoleErrorMock: jest.SpyInstance<void, [message?: any, ...optionalParams: any[]], any>;
  const mockPush = jest.fn();

  beforeEach(() => {
    consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});

    (useRouter as jest.Mock).mockImplementation(() => ({
      push: mockPush,
    }));
    (axiosInstance.post as jest.Mock).mockResolvedValue({
      data: {
        token: "mockToken",
      },
    });
  });

  afterEach(() => {
    consoleErrorMock.mockRestore();
    jest.clearAllMocks();
  });

  it("should log in and set cookie", async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login("username", "password");
    });

    expect(setCookie).toHaveBeenCalledWith("jwt_token", "mockToken", expect.any(Object));
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
    expect(result.current.authState.errorMessage).toBe("");
  });

  it("should handle login error", async () => {
    const mockErrorMessage = "Échec de la connexion : Vérifiez vos identifiants.";
    (axiosInstance.post as jest.Mock).mockRejectedValue(new Error("login failed"));

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login("username", "password");
    });

    expect(result.current.authState.errorMessage).toBe(mockErrorMessage);
  });

  it("should log out and delete cookie", async () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.logout();
    });

    expect(deleteCookie).toHaveBeenCalledWith("jwt_token");
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("should check if user is logged in", () => {
    (getCookie as jest.Mock).mockReturnValueOnce("mockToken");
    const { result: resultLoggedIn } = renderHook(() => useAuth());
    expect(resultLoggedIn.current.isLoggedIn()).toBe(true);

    (getCookie as jest.Mock).mockReturnValueOnce(null);
    const { result: resultLoggedOut } = renderHook(() => useAuth());
    expect(resultLoggedOut.current.isLoggedIn()).toBe(false);
  });
});
