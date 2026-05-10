"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    async function logout() {
        await fetch("/api/logout", {
        method: "POST",
        });

        router.replace("/")
        router.refresh();
    }
    logout();
  }, [router]);



  return (
    <div className="
        h-[90vh] 
        flex flex-col 
        gap-8 
        justify-center items-center"
    >
        <h1>Successfully Logged Out</h1>
        <h1>Redirecting to Home...</h1>
    </div>
  );
}