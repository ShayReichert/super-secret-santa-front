"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userState, setUserState] = useState<UserState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    fetchUserData();
  }, [getCookie("jwt_token")]);

  const fetchUserData = async () => {
    try {
      const jwt = getCookie("jwt_token");

      if (!jwt) {
        setUserState({ data: null, loading: false, error: null });
        return;
      }

      const response = await axios.get("http://localhost:8080/api/user", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      setUserState({ data: response.data, loading: false, error: null });
    } catch (err) {
      if (err instanceof Error) {
        setUserState({ data: null, loading: false, error: err });
      } else {
        setUserState({ data: null, loading: false, error: new Error("Une erreur est survenue") });
      }
    }
  };

  const value = { userState, setUserState };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
