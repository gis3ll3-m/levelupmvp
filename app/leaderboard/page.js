"use client";

import { useEffect, useState } from "react";

export default function LeaderboardPage() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/leaderboard");
                const data = await res.json();

                if (Array.isArray(data)) {
                    setUsers(data);
                } else {
                    setUsers([]);
                }
            } catch (err) {
                console.error(err);
                setUsers([]);
            }
        };

        fetchData();
    }, []);

    const getMedal = (index) => {
        if (index === 0) return "🥇";
        if (index === 1) return "🥈";
        if (index === 2) return "🥉";
        return `#${index + 1}`;
    };

    return (
        <div className="leaderboard-container">
            <h1>🏆 Leaderboard 🏆</h1>

            {users.length === 0 ? (
                <p>No data yet</p>
            ) : (
                <div className="leaderboard-list">
                    {users.map((user, index) => (
                        <div
                            key={user.id}
                            className={`leaderboard-card ${index < 3 ? "top" : ""}`}
                        >
                            {}
                            <div className="left">
                                <div className="rank">
                                    {getMedal(index)}
                                </div>

                                <div className="user-info">
                                    <span className="username">
                                        {user.username}
                                    </span>
                                    <span className="tasks">
                                        {user.completed_tasks} tasks completed
                                    </span>
                                </div>
                            </div>

                            {}
                            <div className="right">
                                <span className="level">Lvl {user.level}</span>
                                <span className="xp">{user.xp} XP</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}