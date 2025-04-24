// API route for handling user profile data
import https from 'https';

export default async function handler(req, res) {
  console.log('Pages Router API route for /api/user-profile was called with method:', req.method);
  
  // Check for HTTP method
  if (req.method === 'GET') {
    return handleGetRequest(req, res);
  } else if (req.method === 'POST' || req.method === 'PUT') {
    return handleUpdateRequest(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

// Handle GET requests to fetch user profile data
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
    
    // For development/demo purposes, return locally stored user data if available
    if (global.storedUserProfiles && global.storedUserProfiles[userId]) {
      console.log(`Returning locally stored profile data for user: ${userId}`);
      return res.status(200).json(global.storedUserProfiles[userId]);
    } else {
      if (!global.storedUserProfiles) {
        global.storedUserProfiles = {};
      }
      // Return empty profile if none exists yet
      return res.status(200).json({
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
      });
    }
    
    /* For production, this would be a call to a real API
    if (!authHeader) {
      console.log('Authorization header missing');
      return res.status(401).json({ error: 'Authorization header missing' });
    }
    
    // Make a direct HTTPS request using Node.js https module
    const apiUrl = `https://dev.theoforge.com/API/users/${userId}/profile`;
    console.log('Fetching from API URL using Node.js https module:', apiUrl);
    
    // Return a promise that resolves with the API response
    const apiPromise = new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        rejectUnauthorized: false, // Ignore SSL certificate errors (DEVELOPMENT ONLY!)
        headers: {
          'Authorization': authHeader
        }
      };
      
      const request = https.request(apiUrl, options, (response) => {
        console.log('API response status:', response.statusCode);
        
        if (response.statusCode !== 200) {
          return reject(new Error(`API request failed with status ${response.statusCode}`));
        }
        
        let data = '';
        
        response.on('data', (chunk) => {
          data += chunk;
        });
        
        response.on('end', () => {
          try {
            const parsedData = JSON.parse(data);
            console.log('Successfully fetched user profile data');
            resolve(parsedData);
          } catch (parseError) {
            console.error('Failed to parse API response as JSON:', parseError);
            reject(new Error('Failed to parse API response as JSON'));
          }
        });
      });
      
      request.on('error', (error) => {
        console.error('Request error:', error);
        reject(error);
      });
      
      // End the request
      request.end();
    });
    
    // Wait for the API response
    const apiData = await apiPromise;
    
    // Return the data with CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return res.status(200).json(apiData);
    */
  } catch (error) {
    console.error('Error in user-profile GET API route:', error);
    return res.status(500).json({ error: 'Failed to fetch user profile data', message: error.message });
  }
}

// Handle POST/PUT requests to update user profile data
async function handleUpdateRequest(req, res) {
  try {
    // Get the profile data from the request body
    const profileData = req.body;
    const userId = req.query.userId || profileData.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    if (!profileData) {
      return res.status(400).json({ error: 'No profile data provided' });
    }
    
    // Validate required fields if needed
    // This is just an example and can be customized based on requirements
    const requiredFields = []; // Add required fields if needed
    const missingFields = requiredFields.filter(field => !profileData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        fields: missingFields
      });
    }
    
    console.log('Saving profile data for user:', userId);
    
    // Extract the auth token from the request headers (optional for development)
    const authHeader = req.headers.authorization;
    console.log('Authorization header present:', !!authHeader);
    
    // Store user profile data locally for development/demo purposes
    if (!global.storedUserProfiles) {
      global.storedUserProfiles = {};
    }
    
    // Add timestamps if not provided
    const enhancedProfileData = {
      ...profileData,
      updated_at: new Date().toISOString()
    };
    
    if (!global.storedUserProfiles[userId]) {
      enhancedProfileData.created_at = enhancedProfileData.created_at || new Date().toISOString();
    }
    
    // Save to our local storage
    global.storedUserProfiles[userId] = {
      ...global.storedUserProfiles[userId], // Preserve existing data
      ...enhancedProfileData // Update with new data
    };
    
    console.log(`User profile data saved locally for user: ${userId}`);
    
    // For demo/development, we'll just return success
    // In production, we would make an API call to a real backend
    return res.status(200).json({
      success: true,
      message: 'User profile data saved successfully',
      data: global.storedUserProfiles[userId]
    });
    
    /* For production, this would be a call to a real API
    if (!authHeader) {
      console.log('Authorization header missing');
      return res.status(401).json({ error: 'Authorization header missing' });
    }
    
    // Make a direct HTTPS request using Node.js https module
    const apiUrl = `https://dev.theoforge.com/API/users/${userId}/profile`;
    console.log('Posting to API URL using Node.js https module:', apiUrl);
    
    // Return a promise that resolves with the API response
    const apiPromise = new Promise((resolve, reject) => {
      const options = {
        method: req.method, // Use the same method (POST or PUT)
        rejectUnauthorized: false, // Ignore SSL certificate errors (DEVELOPMENT ONLY!)
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        }
      };
      
      const request = https.request(apiUrl, options, (response) => {
        console.log('API response status:', response.statusCode);
        
        if (response.statusCode !== 200 && response.statusCode !== 201) {
          return reject(new Error(`API request failed with status ${response.statusCode}`));
        }
        
        let data = '';
        
        response.on('data', (chunk) => {
          data += chunk;
        });
        
        response.on('end', () => {
          try {
            const parsedData = JSON.parse(data);
            console.log('Successfully submitted user profile data');
            resolve(parsedData);
          } catch (parseError) {
            console.error('Failed to parse API response as JSON:', parseError);
            reject(new Error('Failed to parse API response as JSON'));
          }
        });
      });
      
      request.on('error', (error) => {
        console.error('Request error:', error);
        reject(error);
      });
      
      // Write the data to the request body
      request.write(JSON.stringify(profileData));
      request.end();
    });
    
    // Wait for the API response
    const apiData = await apiPromise;
    
    // Return the data with CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return res.status(200).json(apiData);
    */
  } catch (error) {
    console.error('Error in user-profile POST/PUT API route:', error);
    return res.status(500).json({ error: 'Failed to save user profile data', message: error.message });
  }
}
