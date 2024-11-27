import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SessionList = () => {
  const navigate = useNavigate();

  // Get list of available sessions
  const [sessions, setSessions] = useState([
    { id: 1, name: 'General Knowledge Quiz', status: 'open', participants: 5 },
    { id: 2, name: 'Science Quiz', status: 'running', participants: 8 },
    { id: 3, name: 'History Quiz', status: 'open', participants: 3 },
  ]);

  const createNewSession = () => {
    const newSession = {
      id: sessions.length + 1,
      name: `New Quiz Session ${sessions.length + 1}`,
      status: 'open',
      participants: 0,
    };
    setSessions([...sessions, newSession]);
  };

  return (
    <div className="min-h-screen flex flex-col">
    <div className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <h1 className="text-2xl font-bold px-4">Quiz Sessions</h1>
      </div>
      <div className="flex-none">
        <button
          onClick={createNewSession}
          className="btn btn-primary"
        >
          Create New Session
        </button>
      </div>
    </div>

    <div className="flex-1 bg-base-200 p-4">
    <div className="container mx-auto grid gap-4">
        {sessions.map((session) => (
          <div key={session.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="card-title">{session.name}</h2>
                  <div className="flex gap-2 mt-2">
                    <div className="badge badge-ghost">
                      Participants: {session.participants}
                    </div>
                    <div className={`badge ${
                      session.status === 'open' ? 'badge-success' : 'badge-warning'
                    }`}>
                      {session.status.toUpperCase()}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/session/${session.id}`)}
                  className="btn btn-success"
                >
                  Join Session
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default SessionList;