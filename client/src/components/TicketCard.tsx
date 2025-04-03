import { Link } from 'react-router-dom';

import { TicketData } from '../interfaces/TicketData';
import { ApiMessage } from '../interfaces/ApiMessage';
import { MouseEventHandler } from 'react';

// Props interface for TicketCard component
interface TicketCardProps {
  ticket: TicketData;  // The ticket data to display
  deleteTicket: (ticketId: number) => Promise<ApiMessage>  // Function to delete the ticket
}

const TicketCard = ({ ticket, deleteTicket }: TicketCardProps) => {
  // Handle ticket deletion
  const handleDelete: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();
    const ticketId = ticket.id;
    if (ticketId) {
      try {
        await deleteTicket(ticketId);
      } catch (error) {
        console.error('Failed to delete ticket:', error);
      }
    }
  };

  // Format the creation date
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className='ticket-card'>
      {/* Display ticket information */}
      <h3>{ticket.name}</h3>
      <p>{ticket.description}</p>
      <p className="ticket-assignee">Assigned to: {ticket.assignedUser?.username || 'Unassigned'}</p>
      <p className="ticket-date">Created: {formatDate(ticket.createdAt)}</p>
      
      {/* Action buttons */}
      <div className="ticket-actions">
        <Link to={`/edit/${ticket.id}`} className='editBtn'>Edit</Link>
        <button 
          type='button' 
          onClick={handleDelete} 
          className='deleteBtn'
          disabled={!ticket.id}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TicketCard;
