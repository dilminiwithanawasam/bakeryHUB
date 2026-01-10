import { Request, Response } from 'express';
import prisma from '../config/db';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // In a real app, you would count these from the database
    // const pendingOrders = await prisma.orders.count({ where: { status: 'PENDING' } });
    
    // For now, we return mock data that simulates a real database response
    const data = {
      pendingCustomerOrders: 2,
      batchesProduced: 15,
      dispatchedOrders: 14,
      recentActivity: [] // Empty for now as per design
    };

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};
// NEW: Create Batch (Updated for your Schema)
export const createBatch = async (req: Request, res: Response) => {
  try {
    const { product_name, batch_code, quantity, mfd, exp } = req.body;

    // 1. Find the Product ID based on the Name
    const product = await prisma.products.findFirst({
      where: { 
        product_name: {
            equals: product_name,
            mode: 'insensitive' // Case insensitive search
        } 
      }
    });

    if (!product) {
      return res.status(404).json({ error: `Product '${product_name}' not found. Please create the product first.` });
    }

    // 2. Create the Batch using your existing 'batches' table
    const newBatch = await prisma.batches.create({
      data: {
        batch_no: batch_code,
        quantity_produced: parseInt(quantity),
        manufactured_date: new Date(mfd),
        expiry_date: new Date(exp),
        product_id: product.product_id // Link found ID
      }
    });

    res.status(201).json({ message: "Batch created successfully", batch: newBatch });

  } catch (error: any) {
    console.error("Create Batch Error:", error);
    
    // Handle Unique Constraint (Duplicate Batch No)
    if (error.code === 'P2002') {
        return res.status(400).json({ error: "Batch Number already exists!" });
    }
    
    res.status(500).json({ error: "Failed to create batch" });
  }
};