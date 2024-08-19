import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
// import './Routes/types';
// Import routes
import sellerRoutes from './Routes/seller';
import productRoutes from './Routes/products';
import buyerPoutes from './Routes/buyer'
// Import other route files as needed

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Set up middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_CLUSTER}.hnf4m.mongodb.net/?retryWrites=true&w=majority&appName=VendEx`

// Set up routes
app.use('/api', sellerRoutes);
app.use('/api', productRoutes);
app.use('/api', buyerPoutes)
// Use other routes as needed

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .then(()=> {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.error('MongoDB connection error:', error));

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});

export default app;