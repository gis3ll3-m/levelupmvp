"use server"

import pool from "./lib/db";


export async function loginUser(formData) {
    const username = formData.get("username");

    let user = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
    );

    if(user.rows.length === 0){
        user = await pool.query(
            "INSERT INTO users (username) VALUES ($1) RETURNING*",
            [username]
        );
    }

    return user.rows[0];
}

export async function addTask(formData) {
    const title = formData.get("title");
    const userId = formData.get("userId");

    if(!title || !userId) return null;

    const result =await pool.query(
        "INSERT INTO tasks (title, user_id) VALUES ($1, $2) RETURNING id, title",
        [title, userId]
    );
    return result.rows[0];
}