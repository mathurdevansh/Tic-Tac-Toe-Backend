import { useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Board from '../components/Board';
import Modal from '../components/Modal';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function Game() {
    const [searchParams] = useSearchParams();
    const difficulty = searchParams.get('difficulty') || 'Medium';
    const mode = searchParams.get('mode');
    const navigate = useNavigate();
    const { updateUser } = useContext(AuthContext);

    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [winner, setWinner] = useState(null);
    const [winningLine, setWinningLine] = useState(null);
    const [isAiThinking, setIsAiThinking] = useState(false);

    const checkWinner = (squares) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (let line of lines) {
            const [a, b, c] = line;
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return { winner: squares[a], line };
            }
        }
        return null;
    };

    const saveMatch = async (result, finalBoard) => {
        const matchData = {
            players: { player1: 'Player', player2: `AI (${difficulty})` },
            winner: result,
            difficulty,
            moves: finalBoard,
            date: new Date()
        };

        try {
            const localHistory = JSON.parse(localStorage.getItem('matchHistory') || '[]');
            localHistory.unshift(matchData);
            localStorage.setItem('matchHistory', JSON.stringify(localHistory.slice(0, 50)));
        } catch (e) {
            console.error("Local storage error", e);
        }

        const token = localStorage.getItem('token');
        if (token) {
            try {
                const res = await axios.post('https://tic-tac-toe-backend-2-gz9a.onrender.com/api/match', matchData, {
                    headers: { 'x-auth-token': token }
                });
                if (res.data.user) {
                    updateUser(res.data.user);
                }
            } catch (error) {
                console.error("Error saving match:", error);
            }
        }
    };

    const handleClick = async (i) => {
        if (board[i] || winner || isAiThinking) return;

        const newBoard = [...board];
        newBoard[i] = 'X';
        setBoard(newBoard);
        setIsXNext(false);

        const result = checkWinner(newBoard);
        if (result) {
            setWinner(result.winner);
            setWinningLine(result.line);
            saveMatch(result.winner, newBoard);
            return;
        }

        if (!newBoard.includes(null)) {
            setWinner('Draw');
            saveMatch('Draw', newBoard);
            return;
        }

        setIsAiThinking(true);
        try {
            const response = await axios.post('https://tic-tac-toe-backend-2-gz9a.onrender.com/api/ai/move', {
                board: newBoard,
                difficulty,
                player: 'O'
            });

            const aiMove = response.data.move;

            if (aiMove !== null && aiMove !== undefined) {
                setTimeout(() => {
                    const aiBoard = [...newBoard];
                    aiBoard[aiMove] = 'O';
                    setBoard(aiBoard);
                    setIsXNext(true);
                    setIsAiThinking(false);

                    const aiResult = checkWinner(aiBoard);
                    if (aiResult) {
                        setWinner(aiResult.winner);
                        setWinningLine(aiResult.line);
                        saveMatch(aiResult.winner, aiBoard);
                    } else if (!aiBoard.includes(null)) {
                        setWinner('Draw');
                        saveMatch('Draw', aiBoard);
                    }
                }, 500);
            } else {
                setIsAiThinking(false);
            }
        } catch (error) {
            console.error("Error getting AI move:", error);
            setIsAiThinking(false);
        }
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setWinner(null);
        setWinningLine(null);
    };

    const handleCloseModal = () => {
        if (mode === 'campaign' && winner === 'X') {
            navigate('/campaign');
        } else {
            resetGame();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-2">
                    {mode === 'campaign' ? 'Campaign Mode: ' : 'Level: '}
                    <span className="text-blue-400">{difficulty}</span>
                </h2>
                <div className="text-xl text-gray-400 h-8 font-semibold">
                    {winner ? (
                        <span className={winner === 'X' ? 'text-blue-400' : winner === 'O' ? 'text-purple-400' : 'text-gray-400'}>
                            {winner === 'Draw' ? 'Game Draw!' : `${winner} Wins!`}
                        </span>
                    ) : (
                        isAiThinking ? (
                            <span className="flex items-center justify-center gap-2">
                                AI is thinking <span className="animate-pulse">...</span>
                            </span>
                        ) : `Player X's Turn`
                    )}
                </div>
            </div>

            <Board squares={board} onClick={handleClick} winningLine={winningLine} />

            <div className="mt-8 flex gap-4">
                <button onClick={resetGame} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition shadow-md">
                    Restart
                </button>
                <button onClick={() => navigate(mode === 'campaign' ? '/campaign' : '/')} className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-semibold transition shadow-md">
                    Quit
                </button>
            </div>

            <Modal
                isOpen={!!winner}
                onClose={handleCloseModal}
                title={winner === 'Draw' ? 'It\'s a Draw!' : `${winner === 'X' ? 'You Won!' : 'AI Won!'}`}
            >
                <p className="mb-4">{winner === 'X' ? 'Great job!' : winner === 'O' ? 'Better luck next time.' : 'Close match!'}</p>
                {mode === 'campaign' && winner === 'X' && (
                    <p className="text-green-400 font-bold">Points Awarded! Check Campaign for progress.</p>
                )}
            </Modal>
        </div>
    );
}
