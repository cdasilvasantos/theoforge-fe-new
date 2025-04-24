// API route for admin user management
import https from 'https';

export default async function handler(req, res) {
  console.log('Pages Router API route for /api/admin/users was called with method:', req.method);
  
  // Check for HTTP method
  if (req.method === 'GET') {
    return handleGetRequest(req, res);
  } else if (req.method === 'POST') {
    return handleCreateRequest(req, res);
  } else if (req.method === 'PUT') {
    return handleUpdateRequest(req, res);
  } else if (req.method === 'DELETE') {
    return handleDeleteRequest(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

// Initialize users data storage if not available
function initUsersStorage() {
  if (!global.storedUsers) {
    global.storedUsers = [];
  }
  return global.storedUsers;
}

// Handle GET requests to fetch users (admin only)
async function handleGetRequest(req, res) {
  try {
    // Extract the auth token from the request headers
    const authHeader = req.headers.authorization;
    console.log('Authorization header present:', !!authHeader);
    
    // Check authorization (in production, verify this is an admin token)
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Get real users from storage
    const users = initUsersStorage();
    
    // Get query parameters for filtering/sorting
    const { search } = req.query;
    
    let filteredUsers = [...users];
    
    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.email.toLowerCase().includes(searchLower) ||
        user.nickname.toLowerCase().includes(searchLower) ||
        user.first_name.toLowerCase().includes(searchLower) ||
        user.last_name.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort users by most recently updated
    filteredUsers.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    
    console.log(`Returning ${filteredUsers.length} users`);
    return res.status(200).json(filteredUsers);
    
    /* For production, this would be a call to a real API */
  } catch (error) {
    console.error('Error in admin users GET API route:', error);
    return res.status(500).json({ error: 'Failed to fetch users', message: error.message });
  }
}

// Handle POST requests to create a new user (admin only)
async function handleCreateRequest(req, res) {
  try {
    // Extract the auth token from the request headers
    const authHeader = req.headers.authorization;
    console.log('Authorization header present:', !!authHeader);
    
    // Check authorization (in production, verify this is an admin token)
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Get the user data from the request body
    const userData = req.body;
    
    if (!userData) {
      return res.status(400).json({ error: 'No user data provided' });
    }
    
    // Validate required fields
    const requiredFields = ['email', 'nickname', 'first_name', 'last_name', 'role'];
    const missingFields = requiredFields.filter(field => !userData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        fields: missingFields
      });
    }
    
    // Get real users from storage
    const users = initUsersStorage();
    
    // Check if email already exists
    if (users.some(user => user.email === userData.email)) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    
    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      email: userData.email,
      nickname: userData.nickname,
      first_name: userData.first_name,
      last_name: userData.last_name,
      role: userData.role,
      email_verified: userData.email_verified || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add to stored users
    global.storedUsers.push(newUser);
    
    console.log('Created new user:', newUser.id);
    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: newUser
    });
    
    /* For production, this would be a call to a real API */
  } catch (error) {
    console.error('Error in admin users POST API route:', error);
    return res.status(500).json({ error: 'Failed to create user', message: error.message });
  }
}

// Handle PUT requests to update a user (admin only)
async function handleUpdateRequest(req, res) {
  try {
    // Extract the auth token from the request headers
    const authHeader = req.headers.authorization;
    console.log('Authorization header present:', !!authHeader);
    
    // Check authorization (in production, verify this is an admin token)
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Get user ID from query
    const userId = req.query.id;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Get the user data from the request body
    const userData = req.body;
    
    if (!userData) {
      return res.status(400).json({ error: 'No user data provided' });
    }
    
    // Get real users from storage
    const users = initUsersStorage();
    
    // Find user by ID
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if trying to update email to one that already exists
    if (userData.email && userData.email !== users[userIndex].email) {
      const emailExists = users.some(user => user.id !== userId && user.email === userData.email);
      if (emailExists) {
        return res.status(409).json({ error: 'Email already exists' });
      }
    }
    
    // Update user data
    const updatedUser = {
      ...users[userIndex],
      ...userData,
      updated_at: new Date().toISOString()
    };
    
    // Save updated user
    global.storedUsers[userIndex] = updatedUser;
    
    console.log('Updated user:', updatedUser.id);
    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    });
    
    /* For production, this would be a call to a real API */
  } catch (error) {
    console.error('Error in admin users PUT API route:', error);
    return res.status(500).json({ error: 'Failed to update user', message: error.message });
  }
}

// Handle DELETE requests to delete a user (admin only)
async function handleDeleteRequest(req, res) {
  try {
    // Extract the auth token from the request headers
    const authHeader = req.headers.authorization;
    console.log('Authorization header present:', !!authHeader);
    
    // Check authorization (in production, verify this is an admin token)
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Get user ID from query
    const userId = req.query.id;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Get real users from storage
    const users = initUsersStorage();
    
    // Find user by ID
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Don't allow deleting the last admin
    const isAdmin = users[userIndex].role === 'ADMIN';
    if (isAdmin) {
      const adminCount = users.filter(user => user.role === 'ADMIN').length;
      if (adminCount <= 1) {
        return res.status(400).json({ error: 'Cannot delete the last admin user' });
      }
    }
    
    // Remove user
    global.storedUsers.splice(userIndex, 1);
    
    console.log('Deleted user:', userId);
    return res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
    
    /* For production, this would be a call to a real API */
  } catch (error) {
    console.error('Error in admin users DELETE API route:', error);
    return res.status(500).json({ error: 'Failed to delete user', message: error.message });
  }
}
