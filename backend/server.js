const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());

const newsData = [
    { id: 1, title: "AI Breakthrough in 2025", category: "AI", content: "A new AI model surpasses human intelligence in various tasks..." },
    { id: 2, title: "Latest JavaScript Framework", category: "Programming", content: "A new JS framework is revolutionizing web development..." },
    { id: 3, title: "Cybersecurity Alert", category: "Cybersecurity", content: "A critical vulnerability was found in major software systems..." },
    { id: 4, title: "Upcoming Smartphone Innovations", category: "Gadgets", content: "The next-gen smartphones will feature AI-powered assistants..." }
];

app.get('/api/news', (req, res) => {
    res.json(newsData);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
