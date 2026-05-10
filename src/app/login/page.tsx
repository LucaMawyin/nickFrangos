"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/Button";
import Tile from "@/components/Tile";
import { LoginResponse } from "@/lib/types";

export default function Login(){

    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
            router.push("/articles");
            alert("Successfully Logged In")
        } else {
            const data = await response.json() as LoginResponse;
            alert(data.error || "Login failed");
        }

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