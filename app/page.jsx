"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { getToken } from "./lib/session";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    router.replace(token ? "/app/auth/drawer/tabs" : "/app/guest/login");
  }, [router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-sm text-secondary-500">Redirecting...</p>
    </div>
  );
}
