import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Auth from './utils/auth';

function App() {
  return (
    <div className="container">
      {Auth.loggedIn() && <Navbar />}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
