import prisma from '../config/db';
import bcrypt from 'bcryptjs'; // npm install bcryptjs @types/bcryptjs
import jwt from 'jsonwebtoken'; // <--- NEW
import { role_type, Prisma } from '@prisma/client';
const SECRET_KEY = process.env.JWT_SECRET || 'supersecret_bakery_key';

export const registerCustomer = async (data: any) => {
  // 1. Hash the password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // 2. Find the Role ID for 'CUSTOMER'
  const customerRole = await prisma.roles.findUnique({
    where: { role_name: 'CUSTOMER' } // Matches enum role_type
  });

  if (!customerRole) throw new Error("Customer role configuration missing in DB");

  // 3. Transaction: Create User AND Customer profile together
  return await prisma.$transaction(async (tx: any) => {
    // A. Create the User Login
    const newUser = await tx.users.create({
      data: {
        username: data.username,
        email: data.email,
        password_hash: hashedPassword,
        role_id: customerRole.role_id,
        is_active: true
      }
    });

    // B. Create the Customer Profile linked to the User
    const newCustomer = await tx.customers.create({
      data: {
        user_id: newUser.user_id,
        first_name: data.first_name,
        last_name: data.last_name,
        contact_no: data.contact_no,
        address: data.address
      }
    });

    return { user: newUser, customer: newCustomer };
  });
};

export const login = async (data: any) => {
  const user = await prisma.users.findUnique({
    where: { username: data.username },
    include: { roles: true } // Fetch role name
  });

  if (!user) throw new Error("User not found");

  const isValid = await bcrypt.compare(data.password, user.password_hash);
  if (!isValid) throw new Error("Invalid password");

  // In a real app, generate JWT token here
  return { 
    message: "Login successful", 
    userId: user.user_id, 
    role: user.roles.role_name 
  };
};