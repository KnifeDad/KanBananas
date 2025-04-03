import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="container">
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
