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
    const ticketId = Number(event.currentTarget.value);
    if (!isNaN(ticketId)) {
      try {
        const data = await deleteTicket(ticketId);
        return data;
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
      <Link to='/edit' state={{id: ticket.id}} type='button' className='editBtn'>Edit</Link>
      <button type='button' value={ticket.id?.toString() || ''} onClick={handleDelete} className='deleteBtn'>Delete</button>
    </div>
  );
};

export default TicketCard;
