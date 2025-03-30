// /api/proxy.js
export default async (req, res) => {
  const { endpoint, params } = JSON.parse(req.body);
  
  const response = await fetch(`https://newsapi.org/v2/${endpoint}?${new URLSearchParams(params)}`, {
    headers: { 'X-Api-Key': process.env.NEWSAPI_KEY }
  });
  
  res.status(200).json(await response.json());
}
