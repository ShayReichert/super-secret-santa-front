"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import Loader from "../../../components/Loader/Loader";

interface AdminGuardProps {
  children: ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { userState } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (userState.loading === false) {
      if (userState.data && userState.data.roles.includes("ROLE_ADMIN")) {
        setIsAuthorized(true);
      } else {
        router.push("/dashboard");
      }
    }
  }, [userState, router]);

  if (!isAuthorized) {
    return <Loader />;
  }

  return <>{children}</>;
};

export default AdminGuard;
