import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import bikeRoutes from './routes/bikeRoutes.js';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bikes', bikeRoutes);

// Root Check Endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('Classified Bikes Backend API is active!');
});

// Local එකේ Run කරනකොට විතරක් app.listen වැඩ කිරීමට (Vercel වලට මෙය අවශ්‍ය නැත)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// Vercel Serverless Function එකක් ලෙස Export කිරීම
export default app;