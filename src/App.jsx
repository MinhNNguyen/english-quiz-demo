// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SessionList from './components/SessionList';
import SessionPage from './components/SessionPage';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-base-200">
        <Routes>
          <Route path="/session" element={<SessionList />} />
          <Route path="/session/:sessionId" element={<SessionPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;