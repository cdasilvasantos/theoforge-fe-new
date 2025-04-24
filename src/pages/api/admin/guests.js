// API route for admin guest management
import https from 'https';

export default async function handler(req, res) {
  console.log('Pages Router API route for /api/admin/guests was called with method:', req.method);
  
  // Check for HTTP method
  if (req.method === 'GET') {
    return handleGetRequest(req, res);
  } else if (req.method === 'PUT') {
    return handleUpdateRequest(req, res);
  } else if (req.method === 'DELETE') {
    return handleDeleteRequest(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

// Handle GET requests to fetch guests (admin only)
async function handleGetRequest(req, res) {
  try {
    // Extract the auth token from the request headers
    const authHeader = req.headers.authorization;
    console.log('Authorization header present:', !!authHeader);
    
    // Check authorization (in production, verify this is an admin token)
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // For development/demo purposes, use locally stored guest data
    // Initialize if not available
    if (!global.storedGuestData) {
      global.storedGuestData = [];
    }
    
    // Get query parameters for filtering/sorting
    const { search, status, sortBy, sortOrder } = req.query;
    
    let filteredGuests = [...global.storedGuestData];
    
    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase();
      filteredGuests = filteredGuests.filter(guest => 
        (guest.name && guest.name.toLowerCase().includes(searchLower)) ||
        (guest.contact_info && guest.contact_info.toLowerCase().includes(searchLower)) ||
        (guest.company && guest.company.toLowerCase().includes(searchLower)) ||
        (guest.industry && guest.industry.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply status filter if provided
    if (status) {
      filteredGuests = filteredGuests.filter(guest => guest.status === status);
    }
    
    // Apply sorting
    const sortField = sortBy || 'created_at';
    const order = sortOrder === 'asc' ? 1 : -1;
    
    filteredGuests.sort((a, b) => {
      if (!a[sortField]) return order;
      if (!b[sortField]) return -order;
      
      if (typeof a[sortField] === 'string') {
        return order * a[sortField].localeCompare(b[sortField]);
      }
      
      return order * (a[sortField] - b[sortField]);
    });
    
    console.log(`Returning ${filteredGuests.length} guests`);
    return res.status(200).json(filteredGuests);
    
    /* For production, this would be a call to a real API */
  } catch (error) {
    console.error('Error in admin guests GET API route:', error);
    return res.status(500).json({ error: 'Failed to fetch guests', message: error.message });
  }
}

// Handle PUT requests to update a guest (admin only)
async function handleUpdateRequest(req, res) {
  try {
    // Extract the auth token from the request headers
    const authHeader = req.headers.authorization;
    console.log('Authorization header present:', !!authHeader);
    
    // Check authorization (in production, verify this is an admin token)
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Get guest ID from query
    const guestId = req.query.id;
    
    if (!guestId) {
      return res.status(400).json({ error: 'Guest ID is required' });
    }
    
    // Get the guest data from the request body
    const guestData = req.body;
    
    if (!guestData) {
      return res.status(400).json({ error: 'No guest data provided' });
    }
    
    // For development/demo purposes, update locally stored guest data
    if (!global.storedGuestData) {
      global.storedGuestData = [];
    }
    
    // Find guest by ID
    const guestIndex = global.storedGuestData.findIndex(guest => guest.id === guestId);
    
    if (guestIndex === -1) {
      return res.status(404).json({ error: 'Guest not found' });
    }
    
    // Update guest data
    const updatedGuest = {
      ...global.storedGuestData[guestIndex],
      ...guestData,
      updated_at: new Date().toISOString()
    };
    
    // Save updated guest
    global.storedGuestData[guestIndex] = updatedGuest;
    
    console.log('Updated guest:', updatedGuest.id);
    return res.status(200).json({
      success: true,
      message: 'Guest updated successfully',
      guest: updatedGuest
    });
    
    /* For production, this would be a call to a real API */
  } catch (error) {
    console.error('Error in admin guests PUT API route:', error);
    return res.status(500).json({ error: 'Failed to update guest', message: error.message });
  }
}

// Handle DELETE requests to delete a guest (admin only)
async function handleDeleteRequest(req, res) {
  try {
    // Extract the auth token from the request headers
    const authHeader = req.headers.authorization;
    console.log('Authorization header present:', !!authHeader);
    
    // Check authorization (in production, verify this is an admin token)
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Get guest ID from query
    const guestId = req.query.id;
    
    if (!guestId) {
      return res.status(400).json({ error: 'Guest ID is required' });
    }
    
    // For development/demo purposes, update locally stored guest data
    if (!global.storedGuestData) {
      global.storedGuestData = [];
    }
    
    // Find guest by ID
    const guestIndex = global.storedGuestData.findIndex(guest => guest.id === guestId);
    
    if (guestIndex === -1) {
      return res.status(404).json({ error: 'Guest not found' });
    }
    
    // Remove guest
    global.storedGuestData.splice(guestIndex, 1);
    
    console.log('Deleted guest:', guestId);
    return res.status(200).json({
      success: true,
      message: 'Guest deleted successfully'
    });
    
    /* For production, this would be a call to a real API */
  } catch (error) {
    console.error('Error in admin guests DELETE API route:', error);
    return res.status(500).json({ error: 'Failed to delete guest', message: error.message });
  }
}
