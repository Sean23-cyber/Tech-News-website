// /api/proxy.js
export default async (req, res) => {
  try {
    const NEWSAPI_KEY = process.env.NEWSAPI_KEY;
    let endpoint, params;

    // Handle both GET and POST requests
    if (req.method === 'GET') {
      endpoint = req.query.endpoint;
      params = JSON.parse(req.query.params || '{}');
    } else {
      ({ endpoint, params } = JSON.parse(req.body));
    }

    const url = new URL(`https://newsapi.org/v2/${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const apiResponse = await fetch(url, {
      headers: { 'X-Api-Key': NEWSAPI_KEY }
    });

    if (!apiResponse.ok) {
      throw new Error(await apiResponse.text());
    }

    res.status(200).json(await apiResponse.json());
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      status: error.status 
    });
  }
};
