import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Leaderboard() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('https://tic-tac-toe-backend-2-gz9a.onrender.com/api/leaderboard')
            .then(res => setUsers(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="max-w-3xl mx-auto mt-10 p-4">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Global Leaderboard</h2>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
                <table className="w-full text-left text-gray-300">
                    <thead className="bg-gray-900/80 text-gray-400 uppercase text-sm">
                        <tr>
                            <th className="px-6 py-4">Rank</th>
                            <th className="px-6 py-4">Player</th>
                            <th className="px-6 py-4">Level</th>
                            <th className="px-6 py-4">Wins</th>
                            <th className="px-6 py-4">Points</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {users.map((user, index) => (
                            <tr key={user._id} className="hover:bg-gray-700/30 transition">
                                <td className="px-6 py-4 font-bold text-gray-500">#{index + 1}</td>
                                <td className="px-6 py-4 font-semibold text-white">{user.username}</td>
                                <td className="px-6 py-4 text-blue-400">Lvl {user.currentLevel}</td>
                                <td className="px-6 py-4 text-green-400">{user.wins}</td>
                                <td className="px-6 py-4 text-yellow-400 font-bold">{user.points}</td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No players found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="mt-8 text-center">
                <Link to="/" className="text-blue-400 hover:text-blue-300 font-semibold transition">Back to Home</Link>
            </div>
        </div>
    );
}
