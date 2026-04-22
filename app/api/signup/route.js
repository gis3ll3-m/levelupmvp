import { NextResponse } from "next/server";
import pool from "@/app/lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: "Username and password are required" },
                { status: 400 }
            );
        }

        const existing= await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );

        if (existing.rows.length > 0) {
            return NextResponse.json(
                { error: "Username already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (username, password_hash) 
            VALUES ($1, $2) 
            RETURNING id`,
            [ username, hashedPassword]
        );

        return NextResponse.json({userId: result.rows[0].id});
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}