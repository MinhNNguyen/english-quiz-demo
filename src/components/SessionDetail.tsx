// components/SessionPage.js
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import requestUtils from '../utils/request';
import { ErrorList } from '../utils/errors';
import { SessionCategoryMap } from '../types/session';

const wsHost = 'http://localhost:3001';

const SessionDetail = () => {
  const { sessionId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [sessionDetail, setSessionDetail] = useState();
  const [leaderboard, setLeaderboard] = useState([]);

  const socketRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const result = await requestUtils.get(`/sessions/${sessionId}`);
      if (result?.data) {
        setSessionDetail(result.data);
        setLeaderboard(result.data.leaderboard);
      }
    };

    fetchData().catch((error) => {
      console.error(error);
      toast.error(ErrorList.FETCH_SESSION_ERROR);
    });
    setIsLoading(false);
  }, [sessionId]);

  // Handle waiting time before session start
  // Handle session start, user submit question
  // Handle WS

  // useEffect(() => {
  //   socketRef.current = io(wsHost);

  //   socketRef.current.on('connect', () => {
  //     console.log(socketRef.current.id); // x8WIv7-mJelg7on_ALbx
  //   });
  //   socketRef.current.emit('hello', 'world');

  //   // socketRef.current.on('sendDataServer', data => {
  //   //   console.log({data})
  //   // })

  //   // return () => {
  //   //   socketRef.current.disconnect();
  //   // };
  // }, []);

  const [timeRemaining, setTimeRemaining] = useState(30);
  const [currentQuestion, setCurrentQuestion] = useState({
    title: 'What is the capital of France?',
    choices: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 2
  });

  useEffect(() => {
    const timer =
      timeRemaining > 0 &&
      setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining]);

  return isLoading ? (
    <div className='min-h-screen flex flex-col'>
      <span className='m-auto loading loading-spinner loading-lg' />{' '}
    </div>
  ) : (
    <div className='min-h-screen flex flex-col'>
      {/* Top Menu */}
      <div className='navbar bg-base-100 shadow-lg'>
        <div className='flex-1'>
          <span className='text-lg font-semibold px-4'>Session ID: {sessionId}</span>
          <span className='text-lg font-semibold px-4'>Category: {SessionCategoryMap[sessionDetail?.category]}</span>
        </div>
      </div>

      <div className='flex-1 bg-base-200 p-4'>
        <div className='container mx-auto h-full flex gap-4'>
          {/* Leaderboard */}
          <div className='w-80'>
            <div className='card bg-base-100 shadow-xl h-full'>
              <div className='card-body'>
                <h2 className='card-title'>Leaderboard</h2>
                <div className='divider'></div>
                {leaderboard
                  .sort((a, b) => b.score - a.score)
                  .map((player, index) => (
                    <div key={player.username} className='flex justify-between items-center p-2 hover:bg-base-200 rounded-lg'>
                      <div className='flex items-center gap-2'>
                        <div className='badge badge-primary'>{index + 1}</div>
                        <span>{player.username}</span>
                      </div>
                      <span className='font-bold'>{player.score}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Quiz Content */}
          <div className='flex-1'>
            <div className='card bg-base-100 shadow-xl h-full'>
              <div className='card-body'>
                <div className='text-center space-y-4'>
                  <h2 className='text-2xl font-bold'>{currentQuestion.title}</h2>
                  <div className='stats shadow'>
                    <div className='stat'>
                      <div className='stat-title'>Time Remaining</div>
                      <div className='stat-value text-primary'>{timeRemaining}s</div>
                    </div>
                  </div>
                </div>

                <div className='divider'></div>

                <div className='grid grid-cols-2 gap-4'>
                  {currentQuestion.choices.map((choice, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        /* Handle answer selection */
                      }}
                      className='btn btn-outline btn-lg h-24 normal-case text-lg'
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

export default SessionDetail;
