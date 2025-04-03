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

  return (
    <div className='ticket-card'>
      {/* Display ticket information */}
      <h3>{ticket.name}</h3>
      <p>{ticket.description}</p>
      <p>{ticket.assignedUser?.username}</p>
      
      {/* Action buttons */}
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
  );
};

export default TicketCard;
