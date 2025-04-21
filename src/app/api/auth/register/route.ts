import { NextRequest, NextResponse } from 'next/server';

// Mock user database for demonstration
let MOCK_USERS = [
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

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const userData = await request.json();
    console.log('Registration data received:', userData);
    
    // Validate required fields
    const requiredFields = ['email', 'password', 'nickname', 'first_name', 'last_name'];
    for (const field of requiredFields) {
      if (!userData[field]) {
        return NextResponse.json(
          { detail: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Check if email already exists
    if (MOCK_USERS.some(user => user.email === userData.email)) {
      return NextResponse.json(
        { detail: 'Email already registered' },
        { status: 409 }
      );
    }
    
    // Create new user
    const newUser = {
      id: (MOCK_USERS.length + 1).toString(),
      email: userData.email,
      password: userData.password, // In a real app, this would be hashed
      nickname: userData.nickname,
      first_name: userData.first_name,
      last_name: userData.last_name,
      role: 'USER', // Default role for new users
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      phone_number: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      card_number: '',
      subscription_plan: 'FREE'
    };
    
    // Add user to mock database
    MOCK_USERS.push(newUser);
    console.log('New user registered:', newUser.email);
    
    // Return success response (without password)
    const { password, ...userResponse } = newUser;
    return NextResponse.json(userResponse, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}
