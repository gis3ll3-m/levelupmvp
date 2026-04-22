"use client"


import { loginUser } from "../actions"
import { useRouter } from "next/navigation"

export default function LoginPage(){
    const router = useRouter();

    async function handleSubmit(formData){
        const user = await loginUser(formData);

        localStorage.setItem("userId", user.id);
        localStorage.setItem("username", user.username);

        router.push(`/dashboard/${user.id}`);
    }

    return (
        <form action={handleSubmit}>
            <input name="username" placeholder="Username"></input>
            <button type="submit">Login / Signup</button>
        </form>
    );
}