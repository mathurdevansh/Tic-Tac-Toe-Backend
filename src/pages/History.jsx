import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function History() {
    const [matches, setMatches] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchHistory = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axios.get('https://tic-tac-toe-backend-2-gz9a.onrender.com/api/matches/history', {
                        headers: { 'x-auth-token': token }
                    });
                    setMatches(res.data);
                } catch (err) {
                    console.error(err);
                }
            }
        };
        fetchHistory();
    }, []);

    return (
        <div className="max-w-4xl mx-auto mt-10 p-4">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Your Match History</h2>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
                <table className="w-full text-left text-gray-300">
                    <thead className="bg-gray-900/80 text-gray-400 uppercase text-sm">
                        <tr>
                            <th className="px-6 py-4">Result</th>
                            <th className="px-6 py-4">Opponent</th>
                            <th className="px-6 py-4">Difficulty</th>
                            <th className="px-6 py-4">Points</th>
                            <th className="px-6 py-4">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {matches.map((match) => (
                            <tr key={match._id} className="hover:bg-gray-700/30 transition">
                                <td className={`px-6 py-4 font-bold ${match.winner === 'X' ? 'text-green-400' : match.winner === 'O' ? 'text-red-400' : 'text-gray-400'}`}>
                                    {match.winner === 'X' ? 'WIN' : match.winner === 'O' ? 'LOSS' : 'DRAW'}
                                </td>
                                <td className="px-6 py-4">{match.players.player2}</td>
                                <td className="px-6 py-4">{match.difficulty}</td>
                                <td className="px-6 py-4 text-yellow-400 font-semibold">+{match.pointsAwarded}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(match.date).toLocaleDateString()} {new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </td>
                            </tr>
                        ))}
                        {matches.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No matches played yet.</td>
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
