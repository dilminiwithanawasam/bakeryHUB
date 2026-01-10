import prisma from '../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Prisma } from '@prisma/client';

const SECRET_KEY = process.env.JWT_SECRET || 'supersecret_bakery_key';

// --- REGISTER EMPLOYEE ---
export const registerEmployee = async (data: any) => {
  console.log("📝 Registering Employee:", data.username);
  
  // 1. Hash the password (ONLY HERE)
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // 2. Find Role
  const role = await prisma.roles.findUnique({
    where: { role_name: data.role } 
  });
  if (!role) throw new Error(`Invalid Role selected: ${data.role}`);

  // 3. Create User & Employee
  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const newUser = await tx.users.create({
      data: {
        username: data.username,
        email: data.email,
        password_hash: hashedPassword,
        role_id: role.role_id,
        is_active: true
      }
    });

    const newEmployee = await tx.employees.create({
      data: {
        user_id: newUser.user_id,
        first_name: data.first_name,
        last_name: data.last_name,
        nic: data.nic,
        contact_no: data.contact_no,
        hire_date: new Date(data.hire_date),
        employment_status: 'ACTIVE',
      }
    });

    return { user: newUser, employee: newEmployee };
  });
};

// --- REGISTER CUSTOMER ---
export const registerCustomer = async (data: any) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const customerRole = await prisma.roles.findUnique({
    where: { role_name: 'CUSTOMER' }
  });
  if (!customerRole) throw new Error("Customer role configuration missing");

  return await prisma.$transaction(async (tx: any) => {
    const newUser = await tx.users.create({
      data: {
        username: data.username,
        email: data.email,
        password_hash: hashedPassword,
        role_id: customerRole.role_id,
        is_active: true
      }
    });

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

// --- LOGIN (With Debugging & Token) ---
export const login = async (data: any) => {
  console.log("------------------------------------------------");
  console.log("🔍 LOGIN ATTEMPT:", data.username); 

  // 1. Find User
  const user = await prisma.users.findUnique({
    where: { username: data.username },
    include: { roles: true }
  });

  if (!user) {
    console.log("❌ User not found in DB");
    throw new Error("Invalid username or password");
  }

  // 2. Check Password
  // Compares the plain text 'data.password' with the hash from DB
  const isValid = await bcrypt.compare(data.password, user.password_hash);

  if (!isValid) {
    console.log("❌ Password Mismatch!"); 
    // If you see this error, it means the password provided doesn't match the hash.
    throw new Error("Invalid username or password");
  }

  console.log("✅ Password Correct!");

  // 3. Generate Token (CRITICAL STEP YOU WERE MISSING)
  const token = jwt.sign(
    { 
      userId: user.user_id, 
      role: user.roles.role_name 
    }, 
    SECRET_KEY, 
    { expiresIn: '8h' }
  );

  return { 
    message: "Login successful", 
    token: token, // <--- Frontend needs this!
    user: {
      id: user.user_id,
      username: user.username,
      role: user.roles.role_name
    }
  };
};