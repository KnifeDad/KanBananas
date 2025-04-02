import TicketCard from './TicketCard';
import { TicketData } from '../interfaces/TicketData';
import { ApiMessage } from '../interfaces/ApiMessage';

// Props interface for Swimlane component
interface SwimlaneProps {
  title: string;  // The title of the swimlane (Todo, In Progress, Done)
  tickets: TicketData[];  // Array of tickets to display in this swimlane
  deleteTicket: (ticketId: number) => Promise<ApiMessage>  // Function to delete a ticket
}

const Swimlane = ({ title, tickets, deleteTicket }: SwimlaneProps) => {
  // Helper function to determine CSS class based on status
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Todo':
        return 'swim-lane todo';
      case 'In Progress':
        return 'swim-lane inprogress';
      case 'Done':
        return 'swim-lane done';
      default:
        return 'swim-lane';
    }
  };

  return (
    <div className={`swimlane ${getStatusClass(title)}`}>
      <h2>{title}</h2>
      {/* Render ticket cards for each ticket in this swimlane */}
      {tickets.map(ticket => (
        <TicketCard 
          key={ticket.id?.toString()}
          ticket={ticket}
          deleteTicket={deleteTicket}
        />
      ))}
    </div>
  );
};

export default Swimlane;
