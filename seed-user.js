const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function seedUser() {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'noah@speakabout.ai' }
    });

    if (existingUser) {
      console.log('✓ User already exists:', existingUser.email);
      return;
    }

    // Create the user
    const user = await prisma.user.create({
      data: {
        id: '1', // Use the same ID from our auth system
        email: 'noah@speakabout.ai',
        name: 'Noah Cheyer',
        password: hashPassword('StrongCheyer2025!')
      }
    });

    console.log('✓ User created successfully:', user.email);
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedUser();