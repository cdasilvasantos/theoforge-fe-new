import { NextRequest, NextResponse } from 'next/server';

// Mock user data for demonstration
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@admin.com',
    password: 'Password123!',
    nickname: 'admin',
    first_name: 'Admin',
    last_name: 'User',
    role: 'ADMIN',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    phone_number: '555-123-4567',
    address: '123 Admin St',
    city: 'Admin City',
    state: 'AS',
    zip_code: '12345',
    card_number: '',
    subscription_plan: 'PREMIUM'
  },
  {
    id: '2',
    email: 'user@example.com',
    password: 'Password123!',
    nickname: 'user',
    first_name: 'Regular',
    last_name: 'User',
    role: 'USER',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    phone_number: '555-987-6543',
    address: '456 User Ave',
    city: 'User City',
    state: 'US',
    zip_code: '54321',
    card_number: '',
    subscription_plan: 'FREE'
  }
];

// Simple JWT token generation (for demonstration purposes only)
function generateToken(user: any): string {
  // In a real app, you'd use a proper JWT library
  // This is a simplified version for demonstration
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: user.id,
    email: user.email,
    nickname: user.nickname,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
  }));
  const signature = btoa('mock-signature'); // In a real app, this would be cryptographically secure
  
  return `${header}.${payload}.${signature}`;
}

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData();
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    
    console.log(`Login attempt for: ${username}`);
    
    // Find user by email
    const user = MOCK_USERS.find(u => u.email === username);
    
    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return NextResponse.json(
        { detail: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Generate token
    const token = generateToken(user);
    
    // Return successful response with token
    return NextResponse.json(
      { 
        access_token: token,
        token_type: 'bearer'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}
