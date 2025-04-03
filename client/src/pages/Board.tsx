import { useEffect, useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);
  
  // Sorting and filtering state
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'status'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterUser, setFilterUser] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

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

  // Fetch data when component mounts
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchTickets(), fetchUsers()]);
      } catch (err) {
        console.error('Failed to load board data:', err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (auth.loggedIn()) {
      loadData();
    }
  }, []);

  // Sort tickets based on selected criteria
  const sortTickets = (tickets: TicketData[]) => {
    return [...tickets].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '');
          break;
        case 'date':
          // Since createdAt is not in the interface, we'll sort by ID as a fallback
          comparison = (a.id || 0) - (b.id || 0);
          break;
        case 'status':
          comparison = (a.status || '').localeCompare(b.status || '');
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  // Filter tickets based on selected criteria
  const filterTickets = (tickets: TicketData[]) => {
    return tickets.filter(ticket => {
      const userMatch = filterUser === 'all' || ticket.assignedUserId?.toString() === filterUser;
      const statusMatch = filterStatus === 'all' || ticket.status === filterStatus;
      return userMatch && statusMatch;
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

  if (error) {
    return <ErrorPage />;
  }

  if (isLoading) {
    return <div className="loading">Loading board data...</div>;
  }

  // Process tickets for display
  const processedTickets = filterTickets(sortTickets(tickets));

  return (
    <div className="board-container">
      <div className="board-controls">
        <div className="sort-controls">
          <select value={sortBy} onChange={handleSortChange}>
            <option value="name">Sort by Name</option>
            <option value="date">Sort by Date</option>
            <option value="status">Sort by Status</option>
          </select>
          <button onClick={handleSortOrderChange}>
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
        <div className="filter-controls">
          <select value={filterUser} onChange={handleFilterUserChange}>
            <option value="all">All Users</option>
            {users.map(user => (
              <option key={user.id} value={user.id?.toString() || ''}>
                {user.username}
              </option>
            ))}
          </select>
          <select value={filterStatus} onChange={handleFilterStatusChange}>
            <option value="all">All Statuses</option>
            {boardStates.map(state => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="board">
        {boardStates.map(state => (
          <Swimlane
            key={state}
            title={state}
            tickets={processedTickets.filter(ticket => ticket.status === state)}
            deleteTicket={deleteIndvTicket}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
