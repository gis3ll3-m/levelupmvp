"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const id = localStorage.getItem("userId");
        setUserId(id);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("userId");
        window.location.href = "/";
    };

    return (
        <header className="header">
            {}
            <Link href="/" className="logo">
                ⚡ <span>LevelUp</span>
            </Link>

            {}
            <div className="auth">
                {userId ? (
                    <>
                        <Link href={`/dashboard/${userId}`}>Dashboard</Link>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link href="/login">Login</Link>
                        <Link href="/signup">Sign Up</Link>
                    </>
                )}
            </div>
        </header>
    );
}