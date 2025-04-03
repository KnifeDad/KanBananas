import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, LoaderFunctionArgs, redirect } from 'react-router-dom';
import './index.css';

import App from './App.tsx';
import Board from './pages/Board.tsx';
import ErrorPage from './pages/ErrorPage.tsx';
import EditTicket from './pages/EditTicket.tsx';
import CreateTicket from './pages/CreateTicket.tsx';
import Login from './pages/Login.tsx';
import Registration from './pages/Registration.tsx';
import Auth from './utils/auth';

const requireAuth = async (_args: LoaderFunctionArgs) => {
  if (!Auth.loggedIn()) {
    return redirect('/');
  }
  return null;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Login />
      },
      {
        path: 'register',
        element: <Registration />
      },
      {
        path: 'board',
        element: <Board />,
        loader: requireAuth
      },
      {
        path: 'edit/:id',
        element: <EditTicket />,
        loader: requireAuth
      },
      {
        path: 'create',
        element: <CreateTicket />,
        loader: requireAuth
      },
      {
        path: '*',
        element: <ErrorPage />
      }
    ]
  }
]);

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
}
