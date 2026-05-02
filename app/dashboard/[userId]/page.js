"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
    const { userId } = useParams();

    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [difficulty, setDifficulty] = useState("Easy");
    const [category, setCategory] = useState("General");

    const [filter, setFilter] = useState("All");
    const [tab, setTab] = useState("active");
    const [xp, setXp] = useState(0);
    const [username, setUsername] = useState("");
    const [prevLevel, setPrevLevel] = useState(null);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [quote, setQuote] = useState("");

    const [loaded, setLoaded] = useState(false);

    const xpPerLevel = 100;

    const level = Math.floor(xp / xpPerLevel) + 1;
    const progress = xp % xpPerLevel;
    const percent = (progress / xpPerLevel) * 100;


    const fetchTasks = async () => {
        const res = await fetch(`/api/tasks?userId=${userId}`);
        const data = await res.json();
        setTasks(data);
    };

    const fetchUser = async () => {
        const res = await fetch(`/api/users/${userId}`);
        const data = await res.json();

        setXp(data?.xp ?? 0);
        setUsername(data?.username ?? "");
    };

    useEffect(() => {
        if (!userId) return;

        const init = async () => {
            await fetchTasks();
            await fetchUser();
            setLoaded(true);
            setPrevLevel(Math.floor((await (await fetch(`/api/users/${userId}`)).json()).xp / xpPerLevel) + 1);
        };

        init();
    }, [userId]);

    useEffect(() => {
        if (!loaded) return;

        if (prevLevel !== null && level > prevLevel) {
            setShowLevelUp(true);

            setTimeout(() => {
                setShowLevelUp(false);
            }, 1500);
        }

        setPrevLevel(level);
    }, [level]);

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const res = await fetch("/api/quote");
                const data = await res.json();

                setQuote(`${data.quote} — ${data.author}`);
            } catch (err) {
                console.error("Quote error:", err);
            }
        };

        fetchQuote();
    }, []);

    const handleAddTask = async (e) => {
        e.preventDefault();

        await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, userId, difficulty, category })
        });

        setTitle("");
        fetchTasks();
    };

    const completeTask = async (id) => {
        await fetch("/api/tasks", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });

        await fetchTasks();
        await fetchUser();
    };


    const activeTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);

    const baseTasks = tab === "active" ? activeTasks : completedTasks;

    const filteredTasks =
        filter === "All"
            ? baseTasks
            : baseTasks.filter(t => t.category === filter);

    return (
        <div className="container">

            { }
            <div className="card stats-card">

                <div className="stats-header">
                    <div className="stats-user">
                        <h1>Hi {username || "..."}</h1>
                        <p className="subtext">
                            {activeTasks.length + completedTasks.length} total tasks
                        </p>
                    </div>

                    <Link href="/leaderboard" className="leaderboard-btn">
                        Leaderboard
                    </Link>
                </div>

                <h2>Level {level}</h2>
                <h3>Total XP: {xp}</h3>
                <h3>Next Level: {xpPerLevel - progress} XP left</h3>

                {showLevelUp && (
                    <div className="level-up-popup">
                        LEVEL UP! 🎉
                    </div>
                )}

                <div className="xp-bar">
                    <div className="xp-fill" style={{ width: `${percent}%` }} />
                </div>

            </div>

            <div className="card quote-card">
                <p className="quote">{quote}</p>
            </div>

            { }
            <div className="card">

                <form onSubmit={handleAddTask} className="task-form">
                    <input
                        placeholder="New Task"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                    </select>

                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option>General</option>
                        <option>School</option>
                        <option>Fitness</option>
                        <option>Work</option>
                        <option>Personal</option>
                    </select>

                    <button type="submit">Add Task</button>
                </form>

                { }
                <div className="tabs-row">
                    <div className="tabs">
                        <button
                            className={tab === "active" ? "tab active" : "tab"}
                            onClick={() => setTab("active")}
                            type="button"
                        >
                            Active ({activeTasks.length})
                        </button>

                        <button
                            className={tab === "completed" ? "tab active" : "tab"}
                            onClick={() => setTab("completed")}
                            type="button"
                        >
                            Completed ({completedTasks.length})
                        </button>
                    </div>

                    <select
                        className="filter-box"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option>All</option>
                        <option>General</option>
                        <option>School</option>
                        <option>Fitness</option>
                        <option>Work</option>
                        <option>Personal</option>
                    </select>
                </div>

                { }
                <ul>
                    {filteredTasks.map((t) => (
                        <li key={t.id} className="taskItem">

                            <span className={t.completed ? "done" : ""}>
                                {t.title}
                            </span>

                            <span>
                                {t.category} / {t.difficulty} / {t.xp} XP
                            </span>

                            {!t.completed && (
                                <button onClick={() => completeTask(t.id)}>
                                    Complete
                                </button>
                            )}
                        </li>
                    ))}
                </ul>

            </div>
        </div>
    );
}