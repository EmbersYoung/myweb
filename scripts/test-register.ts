import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function testRegister() {
  try {
    console.log('Testing registration...')
    
    const testUser = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'test123456',
    }
    
    console.log('Test user:', testUser)
    
    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: testUser.email },
          { username: testUser.username },
        ],
      },
    })
    
    console.log('Existing user:', existingUser)
    
    if (existingUser) {
      console.log('User already exists, deleting...')
      await prisma.user.delete({ where: { id: existingUser.id } })
      console.log('User deleted')
    }
    
    // Create user
    const passwordHash = await bcrypt.hash(testUser.password, 10)
    console.log('Password hashed')
    
    const user = await prisma.user.create({
      data: {
        email: testUser.email,
        username: testUser.username,
        passwordHash,
      },
    })
    
    console.log('User created successfully!')
    console.log('User details:', {
      id: user.id,
      email: user.email,
      username: user.username,
    })
    
  } catch (error) {
    console.error('Registration failed:')
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

testRegister()