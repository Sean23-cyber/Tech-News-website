// api.js - Secure NewsAPI implementation for Vercel

// API Service (now calls our serverless proxy)
const ApiService = {
    getFeaturedArticles: async (limit = 3) => {
        const res = await fetch(`/api/news?category=technology&pageSize=${limit}`);
        const articles = await res.json();
        return articles.map(article => formatArticle(article, 'Technology'));
    },

    getArticlesByCategory: async (category, page = 1, perPage = 10) => {
        const categoryMap = {
            'all': 'general',
            'AI & Machine Learning': 'technology',
            'Programming': 'technology',
            'Gadgets': 'technology',
            'Security': 'technology'
        };
        const res = await fetch(
            `/api/news?category=${categoryMap[category] || 'technology'}&page=${page}&pageSize=${perPage}`
        );
        const articles = await res.json();
        return articles.map(article => formatArticle(article, category));
    },

    searchArticles: async (query, page = 1, perPage = 10) => {
        const res = await fetch(
            `/api/news?q=${encodeURIComponent(query)}&page=${page}&pageSize=${perPage}`
        );
        const articles = await res.json();
        return articles.map(article => formatArticle(article, 'Search'));
    }
};

// Formatting helper (unchanged)
const formatArticle = (article, category) => ({
    id: article.url,
    title: article.title,
    excerpt: article.description || 'No description available',
    category: category,
    date: new Date(article.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }),
    author: article.author || 'Unknown Author',
    image: article.urlToImage || `https://source.unsplash.com/random/600x400/?${category.toLowerCase()}`,
    url: article.url
});

// DOM rendering functions (unchanged)
document.addEventListener('DOMContentLoaded', () => {
    // ... (keep all your existing DOM code exactly as is)
    // This includes all event listeners and render functions
});
