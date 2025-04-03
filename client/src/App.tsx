import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { useState, useEffect } from 'react';
import Auth from './utils/auth';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(Auth.loggedIn());
    };
    
    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  return (
    <div className="container">
      {isLoggedIn && <Navbar />}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
