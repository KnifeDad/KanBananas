import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
import bcrypt from 'bcrypt';

// Define the structure of a User record
interface UserAttributes {
  id: number;
  username: string;
  password: string;
}

// Define optional fields for creating a new user
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// User model class that extends Sequelize Model
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Method to hash password before saving to database
  // Uses bcrypt with 10 salt rounds for secure password hashing
  public async setPassword(password: string) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(password, saltRounds);
  }
}

// Factory function to initialize the User model
export function UserFactory(sequelize: Sequelize): typeof User {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'users',
      sequelize,
      // Hooks to automatically hash password before creating or updating a user
      hooks: {
        beforeCreate: async (user: User) => {
          await user.setPassword(user.password);
        },
        beforeUpdate: async (user: User) => {
          await user.setPassword(user.password);
        },
      }
    }
  );

  return User;
}
