'use client';

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { checkLogin } from "@/lib/apiClient";

type Props = {
  children: ReactNode
}
const GenericTemplate = ({children}:Props) => {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const isLoggedIn = await checkLogin();
      if (!isLoggedIn) {
        router.replace("login");
      }
    })();
  }, []);

  return (
    <>{children}</>
  )
}

export default GenericTemplate;