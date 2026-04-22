"use client"


import { use, useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function Dashboard({ }) {
    const { userId } = useParams();

    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [difficulty, setDifficulty] = useState("Easy");
    const [xp, setXp] = useState(0);


        const fetchUser = async () => {
            const res = await fetch(`/api/users/${userId}`);
            const data = await res.json();
            setXp(data.xp);
        };

        const fetchTasks = async () => {
            const res = await fetch(`/api/tasks?userId=${userId}`);
            const data = await res.json();
            setTasks(data);
        };

        useEffect(() => {
            if (!userId) return;
            fetchUser();
            fetchTasks();
        }, [userId]);

    //get tasks
    useEffect(() => {
        if (!userId) return;

        const fetchTasks = async (/*id*/) => {
            const res = await fetch(`/api/tasks?userId=${userId}`);
            const data = await res.json();
            setTasks(data);
        };

        fetchTasks();
    }, [userId]);


    const handleAddTask = async (e) => {
        e.preventDefault();

        await fetch("/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, userId, difficulty })

        });

        setTitle("");

        alert("Task added successfully. Refresh to see it in the list.");
    };

    const completeTask = async (id) => {
        await fetch("/api/tasks", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id })
        });

        fetchTasks();
        fetchUser();

    };

    return (
        <div>
            <h1>LevelUp Dashboard</h1>
            <h2>Total XP: {xp}</h2>

            <form onSubmit={handleAddTask}>
                <input name="title" placeholder="New Task" value={title} onChange={(e) => setTitle(e.target.value)}>
                </input>

                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                </select>

                <button type="submit">Add Task</button>
            </form>



            <ul>
                {tasks.map((t) => (
                    <li key={t.id} className="taskItem">
                        <span className={t.completed ? "done" : ""}>{t.title}</span>

                        <span>
                            {t.difficulty} * {t.xp} XP
                        </span>
                        {!t.completed && (
                            <button onClick={() => completeTask(t.id)}>Complete</button>
                        )}
                    </li>


                ))}
            </ul>

        </div>
    );
}