// Centralized API route for handling ALL user data (profile, address, subscription, payment)
import https from 'https';

export default async function handler(req, res) {
  console.log('Pages Router API route for /api/user-data was called with method:', req.method);
  
  // Check for HTTP method
  if (req.method === 'GET') {
    return handleGetRequest(req, res);
  } else if (req.method === 'POST' || req.method === 'PUT') {
    return handleUpdateRequest(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

// Handle GET requests to fetch all user data at once
async function handleGetRequest(req, res) {
  try {
    // Extract the auth token from the request headers
    const authHeader = req.headers.authorization;
    console.log('Authorization header present:', !!authHeader);
    
    // Get user ID from query parameters
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // For development/demo purposes, gather all locally stored user data
    // Initialize storage objects if they don't exist
    if (!global.storedUserProfiles) {
      global.storedUserProfiles = {};
    }
    
    if (!global.storedSubscriptions) {
      global.storedSubscriptions = {};
    }
    
    // Get profile data (or create default)
    const profileData = global.storedUserProfiles[userId] || {
      phone_number: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      card_number: '',
      ccv: '',
      security_code: '',
      subscription_plan: 'FREE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Get subscription data (or create default)
    const subscriptionData = global.storedSubscriptions[userId] || {
      subscription_plan: 'FREE',
      payment_method: '',
      card_number: '',
      card_expiry: '',
      card_cvv: '',
      billing_address: '',
      billing_city: '',
      billing_state: '',
      billing_zip: '',
      billing_country: '',
      start_date: new Date().toISOString(),
      renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Combine all data into a single response
    const userData = {
      profile: profileData,
      subscription: subscriptionData
    };
    
    console.log(`Returning combined user data for user: ${userId}`);
    return res.status(200).json(userData);
    
    /* For production, this would be a call to a real API */
  } catch (error) {
    console.error('Error in user-data GET API route:', error);
    return res.status(500).json({ error: 'Failed to fetch user data', message: error.message });
  }
}

// Handle POST/PUT requests to update all user data at once
async function handleUpdateRequest(req, res) {
  try {
    // Get the user data from the request body
    const userData = req.body;
    const userId = req.query.userId || userData.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    if (!userData) {
      return res.status(400).json({ error: 'No user data provided' });
    }
    
    console.log('Saving all user data for user:', userId);
    
    // Extract the auth token from the request headers (optional for development)
    const authHeader = req.headers.authorization;
    console.log('Authorization header present:', !!authHeader);
    
    // Initialize storage objects if they don't exist
    if (!global.storedUserProfiles) {
      global.storedUserProfiles = {};
    }
    
    if (!global.storedSubscriptions) {
      global.storedSubscriptions = {};
    }
    
    // Current timestamp for updates
    const timestamp = new Date().toISOString();
    
    // Handle profile data if provided
    if (userData.profile) {
      // Add timestamps
      const enhancedProfileData = {
        ...userData.profile,
        updated_at: timestamp
      };
      
      if (!global.storedUserProfiles[userId]) {
        enhancedProfileData.created_at = enhancedProfileData.created_at || timestamp;
      }
      
      // Save to local storage
      global.storedUserProfiles[userId] = {
        ...global.storedUserProfiles[userId], // Preserve existing data
        ...enhancedProfileData // Update with new data
      };
      
      console.log(`Profile data saved locally for user: ${userId}`);
    }
    
    // Handle subscription data if provided
    if (userData.subscription) {
      // Add timestamps
      const enhancedSubscriptionData = {
        ...userData.subscription,
        updated_at: timestamp
      };
      
      if (!global.storedSubscriptions[userId]) {
        enhancedSubscriptionData.created_at = enhancedSubscriptionData.created_at || timestamp;
        
        // Set default values if creating a new subscription
        if (!enhancedSubscriptionData.start_date) {
          enhancedSubscriptionData.start_date = timestamp;
        }
        
        if (!enhancedSubscriptionData.renewal_date) {
          // Default renewal date is 30 days from start date
          const startDate = new Date(enhancedSubscriptionData.start_date);
          enhancedSubscriptionData.renewal_date = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
        }
        
        if (!enhancedSubscriptionData.status) {
          enhancedSubscriptionData.status = 'ACTIVE';
        }
      }
      
      // Save to local storage
      global.storedSubscriptions[userId] = {
        ...global.storedSubscriptions[userId], // Preserve existing data
        ...enhancedSubscriptionData // Update with new data
      };
      
      console.log(`Subscription data saved locally for user: ${userId}`);
      
      // Ensure subscription plan is synchronized with profile
      if (global.storedUserProfiles[userId] && enhancedSubscriptionData.subscription_plan) {
        global.storedUserProfiles[userId].subscription_plan = enhancedSubscriptionData.subscription_plan;
        global.storedUserProfiles[userId].updated_at = timestamp;
      }
    }
    
    // Handle payment data if provided (we'll save this in the subscription object)
    if (userData.payment) {
      if (!global.storedSubscriptions[userId]) {
        global.storedSubscriptions[userId] = {
          subscription_plan: 'FREE',
          status: 'ACTIVE',
          created_at: timestamp,
          updated_at: timestamp
        };
      }
      
      // Update payment details
      global.storedSubscriptions[userId] = {
        ...global.storedSubscriptions[userId],
        ...userData.payment,
        updated_at: timestamp
      };
      
      console.log(`Payment data saved locally for user: ${userId}`);
    }
    
    // Handle address data if provided separately (we'll save this in the profile object)
    if (userData.address) {
      if (!global.storedUserProfiles[userId]) {
        global.storedUserProfiles[userId] = {
          subscription_plan: 'FREE',
          created_at: timestamp,
          updated_at: timestamp
        };
      }
      
      // Update address details
      global.storedUserProfiles[userId] = {
        ...global.storedUserProfiles[userId],
        ...userData.address,
        updated_at: timestamp
      };
      
      console.log(`Address data saved locally for user: ${userId}`);
    }
    
    // Combine updated data for response
    const updatedUserData = {
      profile: global.storedUserProfiles[userId] || {},
      subscription: global.storedSubscriptions[userId] || {}
    };
    
    // For demo/development, we'll just return success
    // In production, we would make an API call to a real backend
    return res.status(200).json({
      success: true,
      message: 'All user data saved successfully',
      data: updatedUserData
    });
    
    /* For production, this would be a call to a real API */
  } catch (error) {
    console.error('Error in user-data POST/PUT API route:', error);
    return res.status(500).json({ error: 'Failed to save user data', message: error.message });
  }
}
