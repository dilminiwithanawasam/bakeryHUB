import { Request, Response } from 'express';
import prisma from '../config/db'; 

// --- Dashboard Stats ---
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // 1. Fetch Counts
    const pendingOrdersCount = 2; 
    const batchesCount = await prisma.batches.count();
    const dispatchedCount = 14; 

    // 2. Fetch Recent Activity
    const recentBatches = await prisma.batches.findMany({
      take: 5,
      // Sort by batch_id since 'created_at' does not exist
      orderBy: { batch_id: 'desc' }, 
      include: {
        // FIX: Use 'products' (plural) as suggested by your error log
        products: {
          select: { product_name: true }
        }
      }
    });

    // 3. Format Activity for Frontend
    const recentActivity = recentBatches.map(batch => ({
      id: batch.batch_id,
      action: "Batch Created",
      // FIX: Access via 'batch.products' (plural)
      details: `Produced ${batch.quantity_produced} ${batch.products.product_name}`,
      // Use manufactured_date as the timestamp
      time: batch.manufactured_date.toISOString() 
    }));

    // 4. Send Response
    res.json({
      pendingCustomerOrders: pendingOrdersCount,
      batchesProduced: batchesCount,
      dispatchedOrders: dispatchedCount,
      recentActivity: recentActivity 
    });

  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};

// --- Batch Management ---
export const createBatch = async (req: Request, res: Response) => {
    try {
        const { product_id, batch_code, quantity, mfd, exp } = req.body;

        if (!product_id || !batch_code || !quantity || !mfd || !exp) {
            return res.status(400).json({ error: "All batch fields are required" });
        }

        const newBatch = await prisma.batches.create({
            data: {
                batch_no: batch_code,
                quantity_produced: parseInt(quantity), 
                manufactured_date: new Date(mfd),
                expiry_date: new Date(exp),
                product_id: parseInt(product_id)
            }
        });

        res.status(201).json({ message: "Batch created successfully", batch: newBatch });

    } catch (error: any) {
        console.error("Create Batch Error:", error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: "Batch Number already exists!" });
        }
        res.status(500).json({ error: "Failed to create batch" });
    }
};