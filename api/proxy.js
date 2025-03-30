// api/proxy.js
module.exports = async (req, res) => {
  const NEWSAPI_KEY = process.env.NEWSAPI_KEY;
  const { endpoint, params } = req.method === 'POST' 
    ? JSON.parse(req.body) 
    : req.query;
  
  try {
    const url = new URL(`https://newsapi.org/v2/${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url, {
      headers: { 'X-Api-Key': NEWSAPI_KEY }
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    res.status(200).json(await response.json());
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      status: error.status 
    });
  }
};
