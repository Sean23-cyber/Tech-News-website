// api.js - Improved version
console.log("API service initialized");

const ApiService = (() => {
    // Configuration
    const PROXY_URL = '/api/proxy';
    const CACHE_TTL = 15 * 60 * 1000; // 15 minutes cache
    
    // Private cache storage
    const cache = {
        data: {},
        timestamps: {},
        get: (key) => {
            if (cache.timestamps[key] && Date.now() - cache.timestamps[key] < CACHE_TTL) {
                return cache.data[key];
            }
            return null;
        },
        set: (key, value) => {
            cache.data[key] = value;
            cache.timestamps[key] = Date.now();
        }
    };

    // Format article data consistently
    const formatArticle = (article, category) => {
        return {
            id: article.url?.replace(/[^a-zA-Z0-9]/g, '-') || `article-${Date.now()}`,
            title: article.title || 'No title available',
            excerpt: article.description || 'No description available',
            content: article.content || '',
            category: category || 'General',
            date: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }) : 'Date not available',
            author: article.author || 'Unknown Author',
            image: article.urlToImage || getFallbackImage(category),
            source: article.source?.name || 'Unknown Source',
            url: article.url || '#',
            readTime: calculateReadTime(article.content)
        };
    };

    // Helper functions
    const getFallbackImage = (category) => {
        const categorySlug = category ? category.toLowerCase().replace(/ /g, '-') : 'technology';
        return `https://source.unsplash.com/random/600x400/?${categorySlug},tech`;
    };

    const calculateReadTime = (content) => {
        if (!content) return '1 min';
        const words = content.split(/\s+/).length;
        const minutes = Math.ceil(words / 200);
        return `${minutes} min read`;
    };

    const handleApiError = (error) => {
        console.error('API Error:', error);
        throw error;
    };

    // Make API request through proxy
    const makeApiRequest = async (endpoint, params) => {
        const cacheKey = `${endpoint}-${JSON.stringify(params)}`;
        const cachedData = cache.get(cacheKey);
        
        if (cachedData) {
            console.log('Returning cached data for', cacheKey);
            return cachedData;
        }

        try {
            const response = await fetch(PROXY_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ endpoint, params })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `API request failed with status ${response.status}`);
            }

            const data = await response.json();
            cache.set(cacheKey, data);
            return data;
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    };

    // Public API
    return {
        /**
         * Fetch featured articles (top headlines in technology)
         * @param {number} limit - Number of articles to return
         * @returns {Promise<Array>} Array of formatted articles
         */
        getFeaturedArticles: async (limit = 3) => {
            const data = await makeApiRequest('top-headlines', {
                category: 'technology',
                pageSize: limit,
                country: 'us'
            });
            return data.articles.map(article => formatArticle(article, 'Featured'));
        },

        /**
         * Fetch articles by category
         * @param {string} category - Category to fetch
         * @param {number} page - Page number
         * @param {number} perPage - Articles per page
         * @returns {Promise<Array>} Array of formatted articles
         */
        getArticlesByCategory: async (category, page = 1, perPage = 10) => {
            const categoryMap = {
                'all': 'general',
                'ai': 'technology',
                'programming': 'technology',
                'gadgets': 'technology',
                'security': 'technology'
            };

            const apiCategory = categoryMap[category.toLowerCase()] || 'technology';
            
            const data = await makeApiRequest('top-headlines', {
                category: apiCategory,
                page,
                pageSize: perPage,
                country: 'us'
            });
            
            return data.articles.map(article => formatArticle(article, category));
        },

        /**
         * Search articles
         * @param {string} query - Search query
         * @param {number} page - Page number
         * @param {number} perPage - Results per page
         * @returns {Promise<Array>} Array of formatted articles
         */
        searchArticles: async (query, page = 1, perPage = 10) => {
            if (!query || query.trim().length < 3) {
                throw new Error('Search query must be at least 3 characters');
            }

            const data = await makeApiRequest('everything', {
                q: query,
                page,
                pageSize: perPage,
                sortBy: 'publishedAt',
                language: 'en'
            });
            
            return data.articles.map(article => formatArticle(article, 'Search'));
        }
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and API service ready");
    
    // Example usage:
    // ApiService.getFeaturedArticles().then(articles => console.log(articles));
});

export default ApiService;
