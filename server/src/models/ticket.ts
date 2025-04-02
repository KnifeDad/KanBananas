import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
import { User } from './user';

// Define the structure of a Ticket record
interface TicketAttributes {
  id: number;
  name: string;
  status: string;
  description: string;
  assignedUserId?: number;
}

// Define optional fields for creating a new ticket
interface TicketCreationAttributes extends Optional<TicketAttributes, 'id'> {}

// Ticket model class that extends Sequelize Model
export class Ticket extends Model<TicketAttributes, TicketCreationAttributes> implements TicketAttributes {
  public id!: number;
  public name!: string;
  public status!: string;
  public description!: string;
  public assignedUserId!: number;

  // Associated User model for the ticket's assignee
  public readonly assignedUser?: User;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Factory function to initialize the Ticket model
export function TicketFactory(sequelize: Sequelize): typeof Ticket {
  Ticket.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      assignedUserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: 'tickets',
      sequelize,
    }
  );

  return Ticket;
}
