// API route for admin dashboard statistics
import https from 'https';

export default async function handler(req, res) {
  console.log('Pages Router API route for /api/admin/stats was called with method:', req.method);
  
  // Only allow GET requests for stats
  if (req.method === 'GET') {
    return handleGetRequest(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

// Handle GET requests to fetch admin dashboard statistics
async function handleGetRequest(req, res) {
  try {
    // Extract the auth token from the request headers
    const authHeader = req.headers.authorization;
    console.log('Authorization header present:', !!authHeader);
    
    // Check authorization (in production, verify this is an admin token)
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Use only real data from storage
    // Initialize storage if needed but don't add any fake data
    if (!global.storedUsers) {
      global.storedUsers = [];
    }
    
    if (!global.storedGuestData) {
      global.storedGuestData = [];
    }
    
    if (!global.storedUserProfiles) {
      global.storedUserProfiles = {};
    }
    
    if (!global.storedSubscriptions) {
      global.storedSubscriptions = {};
    }
    
    // Calculate basic stats
    const totalUsers = global.storedUsers.length;
    const totalGuests = global.storedGuestData.length;
    const verifiedUsers = global.storedUsers.filter(user => user.email_verified).length;
    const adminUsers = global.storedUsers.filter(user => user.role === 'ADMIN').length;
    
    // Calculate subscription stats
    const subscriptionStats = {
      FREE: 0,
      BASIC: 0,
      PREMIUM: 0
    };
    
    // Count subscriptions by plan
    Object.values(global.storedSubscriptions).forEach(subscription => {
      if (subscription.subscription_plan && subscriptionStats.hasOwnProperty(subscription.subscription_plan)) {
        subscriptionStats[subscription.subscription_plan]++;
      } else {
        // Default to FREE if not specified
        subscriptionStats.FREE++;
      }
    });
    
    // Add any users without subscriptions as FREE
    subscriptionStats.FREE += totalUsers - Object.keys(global.storedSubscriptions).length;
    
    // Calculate guest engagement stats
    const guestStats = {
      NEW: 0,
      CONTACTED: 0,
      QUALIFIED: 0,
      CONVERTED: 0
    };
    
    // Count guests by status
    global.storedGuestData.forEach(guest => {
      if (guest.status && guestStats.hasOwnProperty(guest.status)) {
        guestStats[guest.status]++;
      } else {
        // Default to NEW if not specified
        guestStats.NEW++;
      }
    });
    
    // Calculate activity over time (last 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // User activity: registrations by day
    const userRegistrations = {};
    global.storedUsers.forEach(user => {
      const date = new Date(user.created_at);
      if (date >= thirtyDaysAgo) {
        const dateString = date.toISOString().split('T')[0];
        userRegistrations[dateString] = (userRegistrations[dateString] || 0) + 1;
      }
    });
    
    // Guest activity: submissions by day
    const guestSubmissions = {};
    global.storedGuestData.forEach(guest => {
      const date = new Date(guest.created_at);
      if (date >= thirtyDaysAgo) {
        const dateString = date.toISOString().split('T')[0];
        guestSubmissions[dateString] = (guestSubmissions[dateString] || 0) + 1;
      }
    });
    
    // Format activity data for charts
    const activityDates = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
      activityDates.push(date.toISOString().split('T')[0]);
    }
    
    const formattedUserActivity = activityDates.map(date => ({
      date,
      registrations: userRegistrations[date] || 0
    }));
    
    const formattedGuestActivity = activityDates.map(date => ({
      date,
      submissions: guestSubmissions[date] || 0
    }));
    
    // Compile all stats into a response object
    const stats = {
      overview: {
        totalUsers,
        totalGuests,
        verifiedUsers,
        adminUsers
      },
      subscriptions: subscriptionStats,
      guests: guestStats,
      activity: {
        userRegistrations: formattedUserActivity,
        guestSubmissions: formattedGuestActivity
      }
    };
    
    console.log('Calculated admin dashboard statistics');
    return res.status(200).json(stats);
    
    /* For production, this would be a call to a real API */
  } catch (error) {
    console.error('Error in admin stats GET API route:', error);
    return res.status(500).json({ error: 'Failed to fetch admin statistics', message: error.message });
  }
}
