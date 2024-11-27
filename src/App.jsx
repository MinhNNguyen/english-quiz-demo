import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import SessionList from './components/SessionList';
import SessionPage from './components/SessionPage';

import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  // TODO: handle rediract if route does not match

  return (
    <Router>
      <div className='min-h-screen bg-base-200'>
        <Routes>
          <Route path='/sessions' element={<SessionList />} />
          <Route path='/sessions/:sessionId' element={<SessionPage />} />
        </Routes>
      </div>
      <ToastContainer position='bottom-right' hideProgressBar theme='colored' />
    </Router>
  );
};

export default App;
