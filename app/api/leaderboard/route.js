import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function GET() {
    try {
        const result = await pool.query(`
            SELECT 
                u.id,
                u.username,
                u.xp,
                FLOOR(u.xp / 100) + 1 AS level,
                COUNT(t.id) FILTER (WHERE t.completed = true) AS completed_tasks
            FROM users u
            LEFT JOIN tasks t ON u.id = t."user_id"
            GROUP BY u.id, u.username, u.xp
            ORDER BY u.xp DESC
        `);

        return NextResponse.json(result.rows);

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Failed to load leaderboard" },
            { status: 500 }
        );
    }
}