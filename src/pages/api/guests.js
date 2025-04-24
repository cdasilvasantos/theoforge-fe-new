// Using Pages Router API route with native Node.js HTTP/HTTPS
import https from 'https';

export default async function handler(req, res) {
  console.log('Pages Router API route for /api/guests was called with method:', req.method);
  
  // Check for HTTP method
  if (req.method === 'GET') {
    return handleGetRequest(req, res);
  } else if (req.method === 'POST') {
    return handlePostRequest(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

// Handle GET requests to fetch guests
async function handleGetRequest(req, res) {
  try {
    // Extract the auth token from the request headers
    const authHeader = req.headers.authorization;
    console.log('Authorization header present:', !!authHeader);
    
    // For development/demo purposes, return locally stored guest data if available
    if (global.storedGuestData) {
      console.log(`Returning locally stored guest data. Total entries: ${global.storedGuestData.length}`);
      return res.status(200).json(global.storedGuestData);
    } else {
      // Initialize empty array if no data exists yet
      global.storedGuestData = [];
      
      // For demo purposes, add some mock data if requested
      if (req.query.includeMock === 'true') {
        const mockData = [
          { 
            id: 'g1',
            name: 'John Smith',
            contact_info: 'john.smith@example.com',
            company: 'Tech Innovations',
            industry: 'Software',
            project_type: ['Web Development', 'Mobile App'],
            budget: '$50,000 - $100,000',
            timeline: 'Q3 2025',
            pain_points: ['Legacy system integration', 'Scalability issues'],
            current_tech: ['React', 'Node.js', 'MongoDB'],
            additional_notes: 'Looking for a partner to help modernize our customer portal',
            session_id: 'sess_123456',
            status: 'NEW',
            user_id: 'user_1',
            user_email: 'admin@admin.com',
            user_role: 'ADMIN',
            created_at: new Date().toISOString(),
            interaction_events: ['chat_message_welcome', 'chat_message_email', 'chat_message_company'],
            interaction_history: [
              { event: 'chat_message_welcome', timestamp: new Date().toISOString() },
              { event: 'chat_message_email', timestamp: new Date().toISOString() },
              { event: 'chat_message_company', timestamp: new Date().toISOString() }
            ],
            page_views: ['/about', '/services', '/']
          },
          { 
            id: 'g2',
            name: 'Sarah Johnson',
            contact_info: 'sarah.j@example.com',
            company: 'Healthcare Solutions',
            industry: 'Healthcare',
            project_type: ['Enterprise Software'],
            budget: '$100,000+',
            timeline: 'Q4 2025',
            pain_points: ['Data security', 'Compliance requirements', 'User experience'],
            current_tech: ['Java', 'Oracle', 'Angular'],
            additional_notes: 'Need to ensure HIPAA compliance in our new patient portal',
            session_id: 'sess_789012',
            status: 'NEW',
            user_id: 'user_2',
            user_email: 'user@example.com',
            user_role: 'USER',
            created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            interaction_events: ['chat_message_welcome', 'chat_message_email', 'chat_message_company', 'chat_message_industry'],
            interaction_history: [
              { event: 'chat_message_welcome', timestamp: new Date(Date.now() - 86400000).toISOString() },
              { event: 'chat_message_email', timestamp: new Date(Date.now() - 86400000 + 60000).toISOString() },
              { event: 'chat_message_company', timestamp: new Date(Date.now() - 86400000 + 120000).toISOString() },
              { event: 'chat_message_industry', timestamp: new Date(Date.now() - 86400000 + 180000).toISOString() }
            ],
            page_views: ['/', '/services', '/insights']
          }
        ];
        
        // Add mock data to the global storage
        global.storedGuestData = mockData;
        console.log(`Added ${mockData.length} mock guest entries for development/demo purposes`);
        return res.status(200).json(mockData);
      }
      
      // If no mock data requested, return empty array
      return res.status(200).json(global.storedGuestData);
    }
    
    /* Commented out real API call for demo purposes
    if (!authHeader) {
      console.log('Authorization header missing');
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    // Make a direct HTTPS request using Node.js https module
    const apiUrl = 'https://dev.theoforge.com/API/guests/';
    console.log('Fetching from API URL using Node.js https module:', apiUrl);
    
    // Return a promise that resolves with the API response
    const apiPromise = new Promise((resolve, reject) => {
      const options = {
        rejectUnauthorized: false, // Ignore SSL certificate errors (DEVELOPMENT ONLY!)
        headers: {
          'Authorization': authHeader
        }
      };
      
      const request = https.get(apiUrl, options, (response) => {
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
            console.log('Successfully fetched guests data, count:', Array.isArray(parsedData) ? parsedData.length : 'not an array');
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
      
      request.end();
    });
    
    // Wait for the API response
    const apiData = await apiPromise;
    
    // Return the data with CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return res.status(200).json(apiData);
    */
  } catch (error) {
    console.error('Error in guests GET API route:', error);
    return res.status(500).json({ error: 'Failed to fetch guests data', message: error.message });
  }
}

// Handle POST requests to submit guest data
async function handlePostRequest(req, res) {
  try {
    // Get the guest data from the request body
    const guestData = req.body;
    console.log('Submitting guest data:', guestData);
    
    if (!guestData) {
      return res.status(400).json({ error: 'No guest data provided' });
    }
    
    // Extract the auth token from the request headers (optional for guest submissions)
    const authHeader = req.headers.authorization;
    console.log('Authorization header present:', !!authHeader);
    
    // Store guest data locally for development/demo purposes
    // In production, this would be sent to a real API
    if (!global.storedGuestData) {
      global.storedGuestData = [];
    }
    
    // Add an ID and timestamp if not provided
    const enhancedGuestData = {
      ...guestData,
      id: guestData.id || `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      created_at: guestData.created_at || new Date().toISOString()
    };
    
    // Save to our local storage
    global.storedGuestData.push(enhancedGuestData);
    console.log(`Guest data saved locally. Total entries: ${global.storedGuestData.length}`);
    
    // For demo/development, we'll just return success
    // In production, we would make an API call to a real backend
    return res.status(201).json({
      success: true,
      message: 'Guest data saved successfully',
      data: enhancedGuestData
    });
    
    /* Commented out real API call for demo purposes
    // Make a direct HTTPS request using Node.js https module
    const apiUrl = 'https://dev.theoforge.com/API/guests/';
    console.log('Posting to API URL using Node.js https module:', apiUrl);
    
    // Return a promise that resolves with the API response
    const apiPromise = new Promise((resolve, reject) => {
      const options = {
        method: 'POST',
        rejectUnauthorized: false, // Ignore SSL certificate errors (DEVELOPMENT ONLY!)
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      // Add authorization header if present
      if (authHeader) {
        options.headers['Authorization'] = authHeader;
      }
      
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
            console.log('Successfully submitted guest data');
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
      request.write(JSON.stringify(guestData));
      request.end();
    });
    
    // Wait for the API response
    const apiData = await apiPromise;
    
    // Return the data with CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return res.status(201).json(apiData);
    */
  } catch (error) {
    console.error('Error in guests POST API route:', error);
    return res.status(500).json({ error: 'Failed to submit guest data', message: error.message });
  }
}
