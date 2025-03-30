// api/proxy.js - Improved version
require('dotenv').config();
const fetch = require('node-fetch');

module.exports = async (req, res) => {
    // Validate request method
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Parse request body safely
    let endpoint, params;
    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        endpoint = body.endpoint;
        params = body.params || {};
    } catch (error) {
        return res.status(400).json({ error: 'Invalid request body' });
    }

    // Validate required parameters
    if (!endpoint || typeof endpoint !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid endpoint' });
    }

    // Security checks
    const allowedEndpoints = ['top-headlines', 'everything'];
    if (!allowedEndpoints.includes(endpoint)) {
        return res.status(400).json({ error: 'Invalid endpoint' });
    }

    // Rate limiting would be implemented here in production
    // (using something like express-rate-limit)

    try {
        // Construct NewsAPI URL
        const url = new URL(`https://newsapi.org/v2/${endpoint}`);
        
        // Add parameters with validation
        const validParams = {
            'top-headlines': ['country', 'category', 'sources', 'q', 'pageSize', 'page'],
            'everything': ['q', 'sources', 'domains', 'excludeDomains', 'from', 'to', 
                          'language', 'sortBy', 'pageSize', 'page']
        };

        Object.entries(params).forEach(([key, value]) => {
            if (validParams[endpoint].includes(key)) {
                url.searchParams.append(key, value);
            }
        });

        // Add default parameters if needed
        if (endpoint === 'top-headlines' && !url.searchParams.has('country')) {
            url.searchParams.append('country', 'us');
        }

        // Make request to NewsAPI
        const response = await fetch(url, {
            headers: { 
                'X-Api-Key': process.env.NEWSAPI_KEY,
                'User-Agent': 'TechTrends/1.0'
            },
            timeout: 5000 // 5 second timeout
        });

        // Handle response
        if (!response.ok) {
            const errorData = await response.json();
            console.error('NewsAPI Error:', errorData);
            return res.status(response.status).json({ 
                error: errorData.message || 'NewsAPI request failed',
                code: errorData.code
            });
        }

        const data = await response.json();
        
        // Cache control headers
        res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes cache
        
        return res.status(200).json(data);
    } catch (error) {
        console.error('Proxy Error:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
