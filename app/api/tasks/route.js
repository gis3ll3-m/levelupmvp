import { NextResponse } from "next/server";
import pool from "@/app/lib/db";


//get tasks for user
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json(
            { error: "userId is required" },
            { status: 400 }
        );
    }

    const result = await pool.query(
        `SELECT * 
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
    const { title, userId, difficulty } = await req.json();

    if(!title || !userId) {
        return NextResponse.json(
            { error: "Title and userId are required" },
            { status: 400 }
        );
    }

    let xp = 10;
    if(difficulty === "Medium") xp = 20;
    if(difficulty === "Hard") xp = 30;


            const result = await pool.query(
                `INSERT INTO tasks (title, user_id, difficulty,xp) 
                VALUES ($1, $2, $3, $4) 
                RETURNING id, title, completed, difficulty, xp`,
                [title, userId, difficulty, xp]
            );

            return NextResponse.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}

export async function PUT(req) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json(
                { error: "Task id is required" },
                { status: 400 }
            );
        }

        const taskRes = await pool.query(
            "SELECT * FROM tasks WHERE id = $1",
            [id]
        );

        const task = taskRes.rows[0];

        if (!task || task.completed) {
            return NextResponse.json(
                { error: "Task not found or already completed" },
                { status: 404 }
            );
        }

        const updatedTask = await pool.query(
            `UPDATE tasks 
            SET completed = true
            WHERE id = $1
            RETURNING *`,
            [id]
        );

            await pool.query(
            `UPDATE users 
            SET xp = xp + $1
            WHERE id = $2`,
            [task.xp, task.user_id]
        );


        return NextResponse.json(updatedTask.rows[0]);

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
