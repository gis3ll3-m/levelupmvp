"use client"

import { useState } from "react";

export default function SignupPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();

        const res = await fetch("/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (res.ok) {
            alert("Signup successful!");

            localStorage.setItem("userId", data.userId);
            window.location.href = `/dashboard/${data.userId}`;
        } else {
            alert(data.error);
        }

    };

    return (
    <div className="loginPage">
        <form onSubmit={handleSignup} className="loginForm">
            <h1>Create Account</h1>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Start Journey</button>
        </form>

    </div>
    );
}