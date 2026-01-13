import { Request, Response } from 'express';
import * as productService from '../services/productService';

// --- GET: List Products ---
export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error("Fetch Products Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// --- POST: Create Product (With Professional Validation) ---
export const createProduct = async (req: Request, res: Response) => {
    try {
        let { 
            product_name, 
            description, 
            category, 
            base_price, 
            shelf_life_days, 
            measurement_type 
        } = req.body;

        // 1. Sanitize Strings
        product_name = product_name?.trim();
        category = category?.trim();

        // 2. REQUIRED Field Validation
        if (!product_name || !base_price || !shelf_life_days || !measurement_type) {
            return res.status(400).json({ 
                error: "Missing Required Fields", 
                details: "product_name, base_price, shelf_life_days, and measurement_type are required." 
            });
        }

        // 3. TYPE Validation (Ensure numbers are valid)
        const priceValue = parseFloat(base_price);
        const shelfLifeValue = parseInt(shelf_life_days);

        if (isNaN(priceValue) || isNaN(shelfLifeValue)) {
            return res.status(400).json({ error: "Invalid Data Format: Price and Shelf Life must be numbers." });
        }

        // 4. BUSINESS LOGIC Validation
        if (priceValue <= 0) {
            return res.status(400).json({ error: "Price must be greater than 0." });
        }
        if (shelfLifeValue <= 0) {
            return res.status(400).json({ error: "Shelf life must be at least 1 day." });
        }

        // 5. ENUM Validation (Optional safety check)
        const validUnits = ['PCS', 'KG', 'BOX', 'LITRE'];
        if (!validUnits.includes(measurement_type)) {
            return res.status(400).json({ error: `Invalid Unit. Must be one of: ${validUnits.join(', ')}` });
        }

        // 6. Call Service
        const newProduct = await productService.createProduct({
            product_name,
            description,
            category,
            base_price: priceValue,
            shelf_life_days: shelfLifeValue,
            measurement_type
        });

        res.status(201).json({ 
            message: "Product created successfully", 
            product: newProduct 
        });

    } catch (error: any) {
        console.error("Create Product Error:", error);

        // Handle Unique Constraint (Duplicate Name)
        if (error.code === 'P2002') {
            return res.status(409).json({ error: `Product '${req.body.product_name}' already exists.` });
        }

        res.status(500).json({ error: "Failed to create product." });
    }
};