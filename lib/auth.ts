// Simple authentication for MVP - replace with proper auth in production
import crypto from 'crypto';

// Hardcoded users for MVP
const USERS = [
  {
    id: '1',
    name: 'Noah Cheyer',
    email: 'noah@speakabout.ai',
    password: hashPassword('StrongCheyer2025!'),
  }
];

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function authenticateUser(email: string, password: string) {
  const user = USERS.find(u => u.email === email);
  
  if (!user) {
    return null;
  }
  
  const hashedPassword = hashPassword(password);
  if (user.password !== hashedPassword) {
    return null;
  }
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function createUser(name: string, email: string, password: string) {
  // Check if user exists
  const existingUser = USERS.find(u => u.email === email);
  if (existingUser) {
    throw new Error('User already exists');
  }
  
  // Create new user
  const newUser = {
    id: String(USERS.length + 1),
    name,
    email,
    password: hashPassword(password),
  };
  
  USERS.push(newUser);
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

export async function getUserById(id: string) {
  const user = USERS.find(u => u.id === id);
  if (!user) return null;
  
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}