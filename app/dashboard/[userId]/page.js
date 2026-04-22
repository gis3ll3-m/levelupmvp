"use client"


import { useEffect, useState } from "react";
//import { addTask } from "../../actions";
import { useParams } from "next/navigation";

export default function Dashboard({}) {
const{userId} = useParams();
//const [userId, setUserId] = useState(null);
const [tasks, setTask] = useState([]);
const [title, setTitle] = useState("");
const [loading, setLoading] = useState(true);


//get user
/*useEffect(()=>{
    const id = localStorage.getItem("userId");
    setUserId(id);
},[]);
*/

useEffect(() => {
    if (!userId) return;
    const fetchTasks = async (id) => {
        const res = await fetch(`/api/tasks?userId=${userId}`);
        const data = await res.json();
        setTask(data);
    };


    fetchTasks();
}, [userId]);


const handleAddTask = async (e) => {
    e.preventDefault();

    if (!title || !userId) return;

    const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, userId })
    });

    const newTask = await res.json();

    if (newTask) {
        setTask((prev) => [newTask, ...prev]);
        setTitle("");
    }
};


//if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1>LevelUp Dashboard</h1>

            <form onSubmit={handleAddTask}>
                <input name="title" placeholder="New Task" value={title} onChange={(e) => setTitle(e.target.value)}>
                </input>

                <button type="submit">Add Task</button>
            </form>

            <ul>
                {tasks.map((t) => (
                    <li key={t.id}> {t.title} </li>

                ))}
            </ul>

        </div>
    )
}