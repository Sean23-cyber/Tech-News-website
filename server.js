// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const API_KEY = 'YOUR_API_KEY';

app.get('/api/news', async (req, res) => {
    try {
        const { q, pageSize } = req.query;
        const response = await axios.get(`https://newsapi.org/v2/everything`, {
            params: {
                q: q || 'technology',
                pageSize: pageSize || 20,
                apiKey: API_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
