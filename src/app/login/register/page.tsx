"use client";

import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    async function run() {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "lucamawyin@gmail.com",
          password: "1password1",
        }),
      });

      const data = await res.json();
      console.log(data);
    }

    run();
  }, []);

  return <div>Registering user...</div>;
}