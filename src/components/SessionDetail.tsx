// components/SessionPage.js
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import requestUtils from '../utils/request';
import { ErrorList } from '../utils/errors';
import { SessionCategoryMap, SessionState, SessionDetailI, QuestionI, SessionUserI } from '../types/session';

const wsHost = 'http://localhost:3001';
const TIME_PER_QUESTION = 30;

const SessionDetail = () => {
  const { sessionId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [sessionDetail, setSessionDetail] = useState<SessionDetailI | null>(null);
  const [leaderboard, setLeaderboard] = useState<SessionUserI[]>([]);
  const [sessionState, setSessionState] = useState<SessionState | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionI | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const socketRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const result = await requestUtils.get(`/sessions/${sessionId}`);
      if (result?.data) {
        const { leaderboard, ...rest } = result.data;
        setSessionDetail(rest);
        setLeaderboard(leaderboard);
      }

      const currentTime = Date.now() / 1000;
      setSessionState(
        currentTime < result.data.start ? SessionState.OPEN : currentTime > result.data.end ? SessionState.FINISHED : SessionState.RUNNING
      );
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

  // Bug: not able to auto-set session state from running to finished yet
  useEffect(() => {
    let timer;
    const currentTime = Math.round(Date.now() / 1000);
    if (!isLoading && !!sessionDetail && sessionState !== SessionState.FINISHED) {
      if (sessionState === SessionState.OPEN) {
        setTimeRemaining(sessionDetail.start - currentTime);
      } else {
        const questionIndex = Math.floor((currentTime - sessionDetail.start) / TIME_PER_QUESTION);
        setCurrentQuestion(sessionDetail.questions?.[questionIndex]);
        const questionEndTime = sessionDetail.start + (questionIndex + 1) * TIME_PER_QUESTION;
        setTimeRemaining(questionEndTime - currentTime);
      }
      timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      if (timeRemaining && timeRemaining <= 0) {
        if (sessionState === SessionState.OPEN) {
          setSessionState(SessionState.RUNNING);
          setTimeRemaining(null);
        } else if (sessionState === SessionState.RUNNING && currentTime > sessionDetail.end) {
          setSessionState(SessionState.FINISHED);
          setTimeRemaining(null);
        }
      }
    }
    return () => clearInterval(timer);
  }, [isLoading, sessionDetail, sessionState, timeRemaining]);

  const renderOpenSession = () => (
    <div className='card-body'>
      <div className='text-center space-y-4'>
        <h2 className='text-2xl font-bold'>Waiting for other players to join</h2>
        <div className='stat'>
          <div className='stat-title'>Time Remaining</div>
          <div className='stat-value text-primary'>{timeRemaining}s</div>
        </div>
      </div>
    </div>
  );

  const renderFinishedSession = () => (
    <div className='card-body'>
      <div className='text-center space-y-4'>
        <h2 className='text-2xl font-bold'>The quiz is finished</h2>
      </div>
    </div>
  );

  const renderRunningSession = () =>
    currentQuestion && (
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
    );

  return isLoading || !sessionDetail ? (
    <div className='min-h-screen flex flex-col'>
      <span className='m-auto loading loading-spinner loading-lg' />{' '}
    </div>
  ) : (
    <div className='min-h-screen flex flex-col'>
      {/* Top Menu */}
      <div className='navbar bg-base-100 shadow-lg'>
        <div className='flex-1'>
          <span className='text-lg font-semibold px-4'>Session ID: {sessionId}</span>
          <span className='text-lg font-semibold px-4'>Category: {SessionCategoryMap[sessionDetail.category]}</span>
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
                    <div key={player.name} className='flex justify-between items-center p-2 hover:bg-base-200 rounded-lg'>
                      <div className='flex items-center gap-2'>
                        <div className='badge badge-primary'>{index + 1}</div>
                        <span>{player.name}</span>
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
              {sessionState === SessionState.OPEN
                ? renderOpenSession()
                : sessionState === SessionState.RUNNING
                  ? renderRunningSession()
                  : renderFinishedSession()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetail;
