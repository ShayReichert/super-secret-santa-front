"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AxiosError } from "axios";
import axiosInstance from "../services/axiosInstance";
import { getCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [userState, setUserState] = useState<UserState>({
    data: null,
    loading: true,
    error: null,
  });
  const [currentEventId, setCurrentEventId] = useState<number | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const jwt = getCookie("jwt_token");

      if (!jwt) {
        setUserState({ data: null, loading: false, error: null });
        return;
      }

      const response = await axiosInstance.get("api/user");
      setUserState({ data: response.data, loading: false, error: null });
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response && err.response.status === 401) {
          deleteCookie("jwt_token");
          router.push("/login");
        } else {
          console.error("Une erreur est survenue:", err);
          setUserState({ data: null, loading: false, error: err });
        }
      }
    }
  };

  const changeCurrentEvent = (eventId: number) => {
    setCurrentEventId(eventId);
  };

  const value = { userState, setUserState, currentEventId, changeCurrentEvent };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
