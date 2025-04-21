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
    console.log('Authorization header present for POST:', !!authHeader);
    
    // Make a direct HTTPS request using Node.js https module
    const apiUrl = 'https://dev.theoforge.com/API/guests/';
    console.log('Posting to API URL using Node.js https module:', apiUrl);
    
    // Return a promise that resolves with the API response
    const apiPromise = new Promise((resolve, reject) => {
      // Convert the request body to a JSON string
      const postData = JSON.stringify(guestData);
      
      const options = {
        method: 'POST',
        rejectUnauthorized: false, // Ignore SSL certificate errors (DEVELOPMENT ONLY!)
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        }
      };
      
      // Add authorization header if available
      if (authHeader) {
        options.headers['Authorization'] = authHeader;
      }
      
      const request = https.request(apiUrl, options, (response) => {
        console.log('API POST response status:', response.statusCode);
        
        let data = '';
        
        response.on('data', (chunk) => {
          data += chunk;
        });
        
        response.on('end', () => {
          if (response.statusCode >= 200 && response.statusCode < 300) {
            try {
              const parsedData = data ? JSON.parse(data) : { success: true };
              console.log('Successfully submitted guest data');
              resolve(parsedData);
            } catch (error) {
              console.error('Failed to parse API response as JSON:', error);
              // Still resolve even if response is not JSON
              resolve({ success: true, message: 'Guest data submitted successfully' });
            }
          } else {
            console.error('API request failed with status:', response.statusCode);
            reject(new Error(`API request failed with status ${response.statusCode}: ${data}`));
          }
        });
      });
      
      request.on('error', (error) => {
        console.error('Request error:', error);
        reject(error);
      });
      
      // Write the post data to the request
      request.write(postData);
      request.end();
    });
    
    // Wait for the API response
    const apiResponse = await apiPromise;
    
    // Return the data with CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return res.status(201).json(apiResponse);
  } catch (error) {
    console.error('Error in guests POST API route:', error);
    return res.status(500).json({ error: 'Failed to submit guest data', message: error.message });
  }
}
