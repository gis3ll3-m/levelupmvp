import { NextResponse } from "next/server";
import pool from "@/app/lib/db";


//get tasks for user
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

    if (!userId || userId === "null") {
        return NextResponse.json(
            { error: "userId is required" },
            { status: 400 }
        );
    }

    const result = await pool.query(
        `SELECT id, title  
        FROM tasks 
        WHERE user_id = $1 
        ORDER BY id DESC`,
        [userId]
    );
    
    return NextResponse.json(result.rows);
} catch (err) {
    console.error(err);
    return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 }
    );
}
}


//Create task
export async function POST(req) {
    try {
        const { title, userId } = await req.json();

        if (!title || !userId || userId === "null") {
            return NextResponse.json(
                { error: "Invalid task data" },
                { status: 400 }
            );
        }

const [task] = await pool.query(
            `INSERT INTO tasks (title, user_id) 
            VALUES ($1, $2) 
            RETURNING id, title`,
            [title, userId]
        );

return NextResponse.json(task);
} catch (err) {
    console.error(err);
    return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 }
    );
}
}