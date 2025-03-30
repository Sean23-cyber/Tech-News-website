// api.js - Updated to use proxy endpoint securely

// Proxy configuration
const PROXY_URL = '/api/proxy';

// API Service
const ApiService = {
    /**
     * Fetch featured articles (top headlines in technology)
     */
    getFeaturedArticles: async (limit = 3) => {
        try {
            const response = await fetch(PROXY_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    endpoint: 'top-headlines',
                    params: {
                        category: 'technology',
                        pageSize: limit
                    }
                })
            });
            if (!response.ok) throw new Error('Failed to fetch featured articles');
            const data = await response.json();
            return data.articles.map(article => formatArticle(article, 'Technology'));
        } catch (error) {
            handleApiError(error);
        }
    },

    /**
     * Fetch articles by category
     */
    getArticlesByCategory: async (category, page = 1, perPage = 10) => {
        try {
            const categoryMap = {
                'all': 'general',
                'AI & Machine Learning': 'technology',
                'Programming': 'technology',
                'Gadgets': 'technology',
                'Security': 'technology'
            };
            
            const response = await fetch(PROXY_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    endpoint: 'top-headlines',
                    params: {
                        category: categoryMap[category] || 'technology',
                        page: page,
                        pageSize: perPage
                    }
                })
            });
            
            if (!response.ok) throw new Error(`Failed to fetch ${category} articles`);
            const data = await response.json();
            return data.articles.map(article => formatArticle(article, category));
        } catch (error) {
            handleApiError(error);
        }
    },

    /**
     * Search articles
     */
    searchArticles: async (query, page = 1, perPage = 10) => {
        try {
            const response = await fetch(PROXY_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    endpoint: 'everything',
                    params: {
                        q: query,
                        page: page,
                        pageSize: perPage,
                        sortBy: 'publishedAt'
                    }
                })
            });
            
            if (!response.ok) throw new Error('Search failed');
            const data = await response.json();
            return data.articles.map(article => formatArticle(article, 'Search'));
        } catch (error) {
            handleApiError(error);
        }
    }
};

// Helper functions (keep these exactly the same)
const formatArticle = (article, category) => {
    return {
        id: article.url,
        title: article.title,
        excerpt: article.description || 'No description available',
        content: article.content || '',
        category: category,
        date: new Date(article.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        author: article.author || 'Unknown Author',
        image: article.urlToImage || `https://source.unsplash.com/random/600x400/?${category.toLowerCase()}`,
        source: article.source.name,
        url: article.url
    };
};

const handleApiError = (error) => {
    console.error('API Error:', error);
    throw error;
};

// Keep all your existing DOM event listeners and rendering functions exactly the same
document.addEventListener('DOMContentLoaded', () => {
    // ... (all your existing event listeners and rendering code)
});
