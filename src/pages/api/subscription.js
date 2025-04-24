// API route for handling subscription and payment data
import https from 'https';

export default async function handler(req, res) {
  console.log('Pages Router API route for /api/subscription was called with method:', req.method);
  
  // Check for HTTP method
  if (req.method === 'GET') {
    return handleGetRequest(req, res);
  } else if (req.method === 'POST' || req.method === 'PUT') {
    return handleUpdateRequest(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

// Handle GET requests to fetch subscription data
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
    
    // For development/demo purposes, return locally stored subscription data if available
    if (global.storedSubscriptions && global.storedSubscriptions[userId]) {
      console.log(`Returning locally stored subscription data for user: ${userId}`);
      return res.status(200).json(global.storedSubscriptions[userId]);
    } else {
      if (!global.storedSubscriptions) {
        global.storedSubscriptions = {};
      }
      // Return default subscription if none exists yet
      return res.status(200).json({
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
        renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        status: 'ACTIVE',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    
    /* For production, this would be a call to a real API */
  } catch (error) {
    console.error('Error in subscription GET API route:', error);
    return res.status(500).json({ error: 'Failed to fetch subscription data', message: error.message });
  }
}

// Handle POST/PUT requests to update subscription data
async function handleUpdateRequest(req, res) {
  try {
    // Get the subscription data from the request body
    const subscriptionData = req.body;
    const userId = req.query.userId || subscriptionData.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    if (!subscriptionData) {
      return res.status(400).json({ error: 'No subscription data provided' });
    }
    
    console.log('Saving subscription data for user:', userId);
    
    // Extract the auth token from the request headers (optional for development)
    const authHeader = req.headers.authorization;
    console.log('Authorization header present:', !!authHeader);
    
    // Store subscription data locally for development/demo purposes
    if (!global.storedSubscriptions) {
      global.storedSubscriptions = {};
    }
    
    // Add timestamps if not provided
    const enhancedSubscriptionData = {
      ...subscriptionData,
      updated_at: new Date().toISOString()
    };
    
    if (!global.storedSubscriptions[userId]) {
      enhancedSubscriptionData.created_at = enhancedSubscriptionData.created_at || new Date().toISOString();
      
      // Set default values if creating a new subscription
      if (!enhancedSubscriptionData.start_date) {
        enhancedSubscriptionData.start_date = new Date().toISOString();
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
    
    // Save to our local storage
    global.storedSubscriptions[userId] = {
      ...global.storedSubscriptions[userId], // Preserve existing data
      ...enhancedSubscriptionData // Update with new data
    };
    
    console.log(`Subscription data saved locally for user: ${userId}`);
    
    // If the subscription plan has changed, we should update the user profile too
    if (global.storedUserProfiles && global.storedUserProfiles[userId] && 
        enhancedSubscriptionData.subscription_plan &&
        global.storedUserProfiles[userId].subscription_plan !== enhancedSubscriptionData.subscription_plan) {
      
      global.storedUserProfiles[userId].subscription_plan = enhancedSubscriptionData.subscription_plan;
      global.storedUserProfiles[userId].updated_at = new Date().toISOString();
      console.log(`Updated user profile with new subscription plan: ${enhancedSubscriptionData.subscription_plan}`);
    }
    
    // For demo/development, we'll just return success
    // In production, we would make an API call to a real backend
    return res.status(200).json({
      success: true,
      message: 'Subscription data saved successfully',
      data: global.storedSubscriptions[userId]
    });
    
    /* For production, this would be a call to a real API */
  } catch (error) {
    console.error('Error in subscription POST/PUT API route:', error);
    return res.status(500).json({ error: 'Failed to save subscription data', message: error.message });
  }
}
