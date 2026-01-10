import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes';
import authRoutes from './routes/authRoutes';
import factoryRoutes from './routes/factoryRoutes'; // Import

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/factory', factoryRoutes); // Register

app.listen(PORT, () => {
  console.log(`BakeryHUB Backend running on port ${PORT}`);
});