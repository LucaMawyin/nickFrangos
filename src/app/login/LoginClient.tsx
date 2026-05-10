"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/Button";
import Tile from "@/components/Tile";
import { LoginResponse } from "@/lib/types";

export default function Login(props : {isLoggedIn : boolean}){

    const router = useRouter();
    const searchParams = useSearchParams();

    const next = searchParams.get("next") || "/";

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e : React.FormEvent){
        e.preventDefault();

        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email,password}),
        });

        if (response.ok) {
            setError(null);
            router.push(next);
            router.refresh();
        } else {
            const data = await response.json() as LoginResponse;
            setError(data.error || "Login failed");
        }

    }

    if (props.isLoggedIn){
        return (
            <div className="
                h-[90vh] 
                flex flex-col 
                gap-8 
                justify-center items-center"
            >
                <h1>You are already logged in</h1>
                <Button 
                    text="Return to Home" 
                    onClick={() => {
                        router.push("/");
                    }}
                />
            </div>
        );
    }


    return (
        <div className="flex justify-center items-center min-h-[90vh]">
            <Tile 
            title="Login"
            disableHover={true}
            className="md:max-w-[30vw] max-w-full"
            >
                <form 
                    onSubmit={handleSubmit}
                    className="
                        w-full
                        flex flex-col
                        justify-center
                        gap-3"
                >

                    <label htmlFor="email">Enter Your Email:</label>
                    <input 
                        id="email" 
                        type="text" 
                        name="email" 
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label htmlFor="password">Enter Your Password:</label>
                    <div className="flex gap-2 w-full">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className="flex-1"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <button
                            type="button"
                            className="flex-0 hover:cursor-pointer"
                            onClick={() => setShowPassword((p) => !p)}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center">
                            {error}
                        </p>
                    )}

                    <Button 
                        text="Login" 
                        type="submit"
                        className="self-center"
                    />
                </form>
            </Tile>
        </div>
    );
}