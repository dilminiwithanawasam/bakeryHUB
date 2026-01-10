import { Request, Response } from 'express';
import * as authService from '../services/authService';

// Register a new customer
export const register = async (req: Request, res: Response) => {
  try {
    // Calls the service which handles hashing password & creating DB entries
    const result = await authService.registerCustomer(req.body);
    
    // Returns 201 Created with the user info
    res.status(201).json(result);
  } catch (error: any) {
    console.error("Registration Error:", error);
    res.status(400).json({ error: error.message });
  }
};

// Login and get JWT Token
export const login = async (req: Request, res: Response) => {
  try {
    // Calls service which checks password & generates JWT token
    const result = await authService.login(req.body);
    
    // Returns 200 OK with { message, token, user }
    res.json(result);
  } catch (error: any) {
    // Returns 401 Unauthorized if password/user is wrong
    res.status(401).json({ error: error.message });
  }
};