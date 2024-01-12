"use client";

import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import Login from "./login/page";
import Dashboard from "./dashboard/page";
import Loading from "./components/Loading/Loading";

const Home = () => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getCookie("jwt_token");

    setIsLoggedin(!!token);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    // Afficher un loader pendant que la vérification est en cours
    return <Loading />;
  }
  return isLoggedin ? <Dashboard /> : <Login />;
};

export default Home;
