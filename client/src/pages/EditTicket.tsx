import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { retrieveTicket, updateTicket } from '../api/ticketAPI';
import { TicketData } from '../interfaces/TicketData';

const EditTicket = () => {
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const fetchTicket = async (ticketId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await retrieveTicket(parseInt(ticketId));
      setTicket(data);
    } catch (err) {
      console.error('Failed to retrieve ticket:', err);
      setError('Failed to load ticket. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTicket(id);
    } else {
      setError('No ticket ID provided');
      setIsLoading(false);
    }
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!ticket?.id) {
      setError('Cannot update ticket: Missing ticket ID');
      return;
    }

    try {
      await updateTicket(ticket.id, ticket);
      console.log('Ticket updated successfully');
      navigate('/board');
    } catch (error) {
      console.error('Failed to update ticket:', error);
      setError('Failed to update ticket. Please try again.');
    }
  };

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTicket((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTicket((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  if (isLoading) {
    return <div className="loading">Loading ticket...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/board')}>Return to Board</button>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="error">
        <h2>Ticket Not Found</h2>
        <p>The requested ticket could not be found.</p>
        <button onClick={() => navigate('/board')}>Return to Board</button>
      </div>
    );
  }

  return (
    <div className='container'>
      <form className='form' onSubmit={handleSubmit}>
        <h1>Edit Ticket</h1>
        <label htmlFor='tName'>Ticket Name</label>
        <textarea
          id='tName'
          name='name'
          value={ticket.name || ''}
          onChange={handleTextAreaChange}
          required
        />
        <label htmlFor='tStatus'>Ticket Status</label>
        <select
          name='status'
          id='tStatus'
          value={ticket.status || ''}
          onChange={handleChange}
          required
        >
          <option value='Todo'>Todo</option>
          <option value='In Progress'>In Progress</option>
          <option value='Done'>Done</option>
        </select>
        <label htmlFor='tDescription'>Ticket Description</label>
        <textarea
          id='tDescription'
          name='description'
          value={ticket.description || ''}
          onChange={handleTextAreaChange}
          required
        />
        <button type='submit'>Update Ticket</button>
      </form>
    </div>
  );
};

export default EditTicket;
