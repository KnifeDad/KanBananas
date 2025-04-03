import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { useState, useEffect } from 'react';
import Auth from './utils/auth';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Provide navigation function to Auth utility
    Auth.setNavigate(navigate);

    const checkLoginStatus = () => {
      const loggedIn = Auth.loggedIn();
      console.log('App: Checking login status:', loggedIn);
      setIsLoggedIn(loggedIn);
    };
    
    // Check immediately
    checkLoginStatus();
    
    // Listen for storage changes
    window.addEventListener('storage', checkLoginStatus);
    
    // Check when auth state changes
    const interval = setInterval(checkLoginStatus, 1000);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      clearInterval(interval);
    };
  }, [navigate]);

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
