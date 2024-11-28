import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SessionI, SessionState, SessionCategoryMap } from '../types/session';
import requestUtils from '../utils/request';
import { ErrorList } from '../utils/errors';

const SessionItem = ({ session }: { session: SessionI }) => {
  const navigate = useNavigate();

  const handleJoinSession = async (sessionId) => {
    try {
      const result = await requestUtils.post(`/sessions/${sessionId}/join`);
      if (result?.data?.result) {
        navigate(`/sessions/${sessionId}`);
      }
    } catch (error) {
      console.error(error);
      toast.error(ErrorList.JOIN_SESSION_ERROR);
    }
  };

  return (
    <div key={session.id} className='card bg-base-100 shadow-xl'>
      <div className='card-body'>
        <div className='flex justify-between items-center'>
          <div>
            <h2 className='card-title'>{SessionCategoryMap[session.category]}</h2>
            <div className='flex gap-2 mt-2'>
              <div className='badge badge-ghost'>Participants: {session.participants}</div>
              <div className={`badge ${session.status === SessionState.OPEN ? 'badge-success' : 'badge-warning'}`}>
                {session.status.toUpperCase()}
              </div>
            </div>
          </div>
          <button onClick={() => handleJoinSession(session.id)} className='btn btn-success'>
            Join Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionItem;
