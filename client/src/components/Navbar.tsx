import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import auth from '../utils/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = auth.loggedIn();
      console.log('Checking login status:', loggedIn);
      setIsLoggedIn(loggedIn);
    };
    
    // Check immediately
    checkLoginStatus();
    
    // Listen for storage changes
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    console.log('Logging out...');
    auth.logout();
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div className='nav'>
      <div className='nav-title'>
        <Link to='/board'>Welcome to KanBananas: The Krazy Kanban Board</Link>
      </div>
      <ul>
        {isLoggedIn && (
          <>
            <li className='nav-item'>
              <button type='button'>
                <Link to='/create'>New Ticket</Link>
              </button>
            </li>
            <li className='nav-item'>
              <button type='button' onClick={handleLogout}>Logout</button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
