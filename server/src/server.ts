// Flag to control database refresh on server start
const forceDatabaseRefresh = false;

// Import required dependencies
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { sequelize } from './models/index.js';

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS based on environment
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL // Production frontend URL
    : 'http://localhost:3000', // Development frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Enable CORS with configured options
app.use(cors(corsOptions));

// Serves static files in the entire client's dist folder
app.use(express.static('../client/dist'));

// Parse JSON request bodies
app.use(express.json());

// Use routes from routes/index.ts
app.use('/', routes);

// Sync database and start server
// force: true will drop all tables and recreate them
sequelize.sync({force: forceDatabaseRefresh}).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
