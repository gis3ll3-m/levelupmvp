import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function GET(req, { params }) {
    try {
        const { userId } = await params;

        if (!userId) {
            return NextResponse.json(
                { error: "userId is required" },
                { status: 400 }
            );
        }

        const result = await pool.query(
            "SELECT xp, username FROM users WHERE id = $1",
            [userId]
        );

        return NextResponse.json(result.rows[0] ?? { xp: 0 });

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}