import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { SessionI } from '../types/session';
import requestUtils from '../utils/request';
import SessionItem from './SessionItem'

const SessionList = () => {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState<SessionI[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await requestUtils.get('/sessions');
      if (result?.data?.sessions) {
        setSessions(result.data.sessions);
      }
    };

    fetchData().catch((error) => {
      console.error(error);
    });
  }, []);

  const handleCreateNewSession = async () => {
    try {
      const result = await requestUtils.post('/sessions/create');
      if (result?.data?.id) {
        navigate(`/session/${result.data.id}`);
      }
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  return (
    <div className='w-full min-h-screen flex flex-col'>
      <div className='navbar bg-base-100 shadow-lg'>
        <div className='flex-1'>
          <h1 className='text-2xl font-bold px-4'>Quiz Sessions</h1>
        </div>
        <div className='flex-none'>
          <button onClick={handleCreateNewSession} className='btn btn-primary'>
            Create New Session
          </button>
        </div>
      </div>

      <div className='flex-1 bg-base-200 p-4'>
        <div className='container mx-auto grid gap-4'>
          {sessions.map((session) => (
            <SessionItem session={session} key={session.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SessionList;
