import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../models/user.js';

const router = express.Router();

// Registration endpoint
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Received registration request:', { username: req.body.username });
    const { username, password } = req.body;

    if (!username || !password) {
      console.log('Missing username or password');
      res.status(400).json({ message: 'Username and password are required' });
      return;
    }

    // Check if username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      console.log('Username already exists:', username);
      res.status(400).json({ message: 'Username already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    // Create new user
    const user = await User.create({
      username,
      password: hashedPassword
    });
    console.log('User created successfully:', { id: user.id, username: user.username });

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );
    console.log('JWT token created successfully');

    res.status(201).json({ token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Received login request:', { username: req.body.username });
    const { username, password } = req.body;

    if (!username || !password) {
      console.log('Missing username or password');
      res.status(400).json({ message: 'Username and password are required' });
      return;
    }

    // Find user by username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      console.log('User not found:', username);
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log('Invalid password for user:', username);
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );
    console.log('Login successful, token created for user:', username);

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
