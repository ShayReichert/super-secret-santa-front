"use client";

import React, { useEffect, useState } from "react";
import Login from "./login/page";
import Loading from "./components/Loading/Loading";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return <Login />;
};

export default Home;
