"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyLoginClient() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [status, setStatus] = useState("verifying");

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            setStatus("missing");
            return;
        }

        const verify = async () => {
            try {
                const res = await fetch("/api/verify-login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token }),
                });

                if (!res.ok) {
                    setStatus("invalid");
                    return;
                }

                setStatus("success");

                setTimeout(() => {
                    router.push("/");
                    router.refresh();
                }, 1000);

            } catch (err) {
                setStatus("error");
            }
        };

        verify();
    }, [searchParams, router]);

    if (status === "verifying") {
        return <p>Verifying login...</p>;
    }

    if (status === "success") {
        return <p>Login verified! Redirecting...</p>;
    }

    if (status === "invalid") {
        return <p>Invalid or expired login link.</p>;
    }

    return <p>Something went wrong.</p>;
}