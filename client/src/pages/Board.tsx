import { useEffect, useState, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';

import { retrieveTickets, deleteTicket } from '../api/ticketAPI';
import { retrieveUsers } from '../api/userAPI';
import ErrorPage from './ErrorPage';
import Swimlane from '../components/Swimlane';
import { TicketData } from '../interfaces/TicketData';
import { UserData } from '../interfaces/UserData';
import { ApiMessage } from '../interfaces/ApiMessage';

import auth from '../utils/auth';

// Define possible board states for swimlanes
const boardStates = ['Todo', 'In Progress', 'Done'];

const Board = () => {
  // State management for tickets, users, and UI controls
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [error, setError] = useState(false);
  const [loginCheck, setLoginCheck] = useState(false);
  
  // Sorting and filtering state
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'status'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterUser, setFilterUser] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Check if user is logged in
  const checkLogin = () => {
    if(auth.loggedIn()) {
      setLoginCheck(true);
    }
  };

  // Fetch tickets from API
  const fetchTickets = async () => {
    try {
      const data = await retrieveTickets();
      setTickets(data);
    } catch (err) {
      console.error('Failed to retrieve tickets:', err);
      setError(true);
    }
  };

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const data = await retrieveUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to retrieve users:', err);
    }
  };

  // Delete a ticket and refresh the board
  const deleteIndvTicket = async (ticketId: number) : Promise<ApiMessage> => {
    try {
      const data = await deleteTicket(ticketId);
      fetchTickets();
      return data;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  // Check login status on component mount
  useLayoutEffect(() => {
    checkLogin();
  }, []);

  // Fetch data when user is logged in
  useEffect(() => {
    if(loginCheck) {
      fetchTickets();
      fetchUsers();
    }
  }, [loginCheck]);

  // Sort tickets based on selected criteria
  const sortTickets = (tickets: TicketData[]) => {
    return [...tickets].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  // Filter tickets based on user and status
  const filterTickets = (tickets: TicketData[]) => {
    return tickets.filter(ticket => {
      const matchesUser = filterUser === 'all' || ticket.assignedUserId === parseInt(filterUser);
      const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
      return matchesUser && matchesStatus;
    });
  };

  // Event handlers for sorting and filtering
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as 'name' | 'date' | 'status');
  };

  const handleSortOrderChange = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleFilterUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterUser(e.target.value);
  };

  const handleFilterStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
  };

  // Show error page if there's an error
  if (error) {
    return <ErrorPage />;
  }

  return (
    <>
    {
      !loginCheck ? (
        <div className='login-notice'>
          <h1>
            Login to create & view tickets
          </h1>
        </div>  
      ) : (
          <div className='board'>
            {/* New Ticket Button */}
            <button type='button' id='create-ticket-link'>
              <Link to='/create'>New Ticket</Link>
            </button>
            
            {/* Filter Controls */}
            <div className='filters-container'>
              {/* Sort Controls */}
              <div className='filter-group'>
                <label htmlFor='sortBy'>Sort by:</label>
                <select id='sortBy' value={sortBy} onChange={handleSortChange}>
                  <option value='name'>Name</option>
                  <option value='date'>Date</option>
                  <option value='status'>Status</option>
                </select>
                <button onClick={handleSortOrderChange} className='sort-order-btn'>
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>

              {/* User Filter */}
              <div className='filter-group'>
                <label htmlFor='filterUser'>Filter by User:</label>
                <select id='filterUser' value={filterUser} onChange={handleFilterUserChange}>
                  <option value='all'>All Users</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className='filter-group'>
                <label htmlFor='filterStatus'>Filter by Status:</label>
                <select id='filterStatus' value={filterStatus} onChange={handleFilterStatusChange}>
                  <option value='all'>All Statuses</option>
                  {boardStates.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Kanban Board Display */}
            <div className='board-display'>
              {boardStates.map((status) => {
                let filteredTickets = tickets.filter(ticket => ticket.status === status);
                filteredTickets = filterTickets(filteredTickets);
                filteredTickets = sortTickets(filteredTickets);
                
                return (
                  <Swimlane 
                    title={status} 
                    key={status} 
                    tickets={filteredTickets} 
                    deleteTicket={deleteIndvTicket}
                  />
                );
              })}
            </div>
          </div>
        )
    }
    </>
  );
};

export default Board;
