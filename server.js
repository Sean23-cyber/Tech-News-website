const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Sample data - could move to a separate file
const newsData = [
    { id: 1, title: "AI Breakthrough in 2025", category: "AI", content: "A new AI model...", date: "2025-01-15" },
    { id: 2, title: "Latest JavaScript Framework", category: "Programming", content: "A new JS framework...", date: "2025-01-10" }
];

// API endpoints
app.get('/api/news', (req, res) => {
    // Add simple filtering
    const { category } = req.query;
    let results = newsData;
    
    if (category) {
        results = newsData.filter(item => 
            item.category.toLowerCase() === category.toLowerCase()
        );
    }
    
    res.json(results);
});

app.get('/api/news/:id', (req, res) => {
    const newsItem = newsData.find(item => item.id === parseInt(req.params.id));
    if (newsItem) {
        res.json(newsItem);
    } else {
        res.status(404).json({ error: 'News item not found' });
    }
});

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
