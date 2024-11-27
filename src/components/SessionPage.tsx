// components/SessionPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const SessionPage = () => {
  const { sessionId } = useParams();
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [currentQuestion, setCurrentQuestion] = useState({
    title: 'What is the capital of France?',
    choices: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 2,
  });
  const [leaderboard, setLeaderboard] = useState([
    { username: 'Player1', score: 100 },
    { username: 'Player2', score: 85 },
    { username: 'Player3', score: 70 },
  ]);

  useEffect(() => {
    const timer = timeRemaining > 0 && setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Menu */}
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <span className="text-lg font-semibold px-4">
            Session ID: {sessionId}
          </span>
        </div>
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src="/api/placeholder/40/40" alt="avatar" />
              </div>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><a>Player1</a></li>
              <li><a>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-base-200 p-4">
        <div className="container mx-auto h-full flex gap-4">
            {/* Leaderboard */}
            <div className="w-80">
            <div className="card bg-base-100 shadow-xl h-full">
                <div className="card-body">
                <h2 className="card-title">Leaderboard</h2>
                <div className="divider"></div>
                {leaderboard
                    .sort((a, b) => b.score - a.score)
                    .map((player, index) => (
                    <div
                        key={player.username}
                        className="flex justify-between items-center p-2 hover:bg-base-200 rounded-lg"
                    >
                        <div className="flex items-center gap-2">
                        <div className="badge badge-primary">{index + 1}</div>
                        <span>{player.username}</span>
                        </div>
                        <span className="font-bold">{player.score}</span>
                    </div>
                    ))}
                </div>
            </div>
            </div>

            {/* Quiz Content */}
            <div className="flex-1">
            <div className="card bg-base-100 shadow-xl h-full">
                <div className="card-body">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold">{currentQuestion.title}</h2>
                    <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-title">Time Remaining</div>
                        <div className="stat-value text-primary">{timeRemaining}s</div>
                    </div>
                    </div>
                </div>
                
                <div className="divider"></div>

                <div className="grid grid-cols-2 gap-4">
                    {currentQuestion.choices.map((choice, index) => (
                    <button
                        key={index}
                        onClick={() => {/* Handle answer selection */}}
                        className="btn btn-outline btn-lg h-24 normal-case text-lg"
                    >
                        {choice}
                    </button>
                    ))}
                </div>
                </div>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SessionPage;