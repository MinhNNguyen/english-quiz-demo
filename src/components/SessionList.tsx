import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import requestUtils from '../utils/request'

const SessionList = () => {
  const navigate = useNavigate()

  // Get list of available sessions
  const [sessions, setSessions] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const result = await requestUtils.get('/sessions')
      if (result?.data?.sessions) {
        setSessions(result.data.sessions)
      }
    }

    fetchData()
    .catch(error => {
      console.error(error)
    })
  }, [])

  const handleCreateNewSession = async () => {
    try {
      const result = await requestUtils.post('/sessions/create')
      if (result?.data?.id) {
        navigate(`/session/${result.data.id}`)
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  }

  const handleJoinSession = async (sessionId) => {
    try {
      const result = await requestUtils.post(`/sessions/${sessionId}/join`)
      if (result?.data?.result) {
        navigate(`/session/${sessionId}`)
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  }

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
            <div key={session.id} className='card bg-base-100 shadow-xl'>
              <div className='card-body'>
                <div className='flex justify-between items-center'>
                  <div>
                    <h2 className='card-title'>{session.name}</h2>
                    <div className='flex gap-2 mt-2'>
                      <div className='badge badge-ghost'>Participants: {session.participants}</div>
                      <div className={`badge ${session.status === 'open' ? 'badge-success' : 'badge-warning'}`}>
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
          ))}
        </div>
      </div>
    </div>
  )
}

export default SessionList
