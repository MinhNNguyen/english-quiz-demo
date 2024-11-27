import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import SessionList from './components/SessionList'
import SessionPage from './components/SessionPage'

import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <Router>
      <div className='min-h-screen bg-base-200'>
        <Routes>
          <Route path='/session' element={<SessionList />} />
          <Route path='/session/:sessionId' element={<SessionPage />} />
        </Routes>
      </div>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
    </Router>
  )
}

export default App
