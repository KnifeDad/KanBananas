import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Board from './pages/Board';
import Auth from './utils/auth';

import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route 
          path="/board" 
          element={
            Auth.loggedIn() ? (
              <Board />
            ) : (
              <Login />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
