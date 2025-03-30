// api.js - API handling for TechTrends using NewsAPI.org

// API Configuration
const API_BASE_URL = 'https://newsapi.org/v2';
const API_KEY = 'YOUR_NEWSAPI_KEY'; // Replace with your actual API key

// API endpoints mapping to NewsAPI
const API_ENDPOINTS = {
    topHeadlines: '/top-headlines',
    everything: '/everything',
    sources: '/sources'
};

// Common headers for API requests
const getHeaders = () => {
    return {
        'Content-Type': 'application/json',
        // NewsAPI requires the API key in the headers
        'X-Api-Key': API_KEY
    };
};

// Handle API errors
const handleApiError = (error) => {
    console.error('API Error:', error);
    throw error;
};

// Map our categories to NewsAPI's possible query parameters
const categoryMap = {
    'all': 'general',
    'AI & Machine Learning': 'technology',
    'Programming': 'technology',
    'Gadgets': 'technology',
    'Security': 'technology'
};

// API Service
const ApiService = {
    /**
     * Fetch featured articles (top headlines in technology)
     * @param {number} limit - Number of articles to fetch
     * @returns {Promise} - Promise with featured articles data
     */
    getFeaturedArticles: async (limit = 3) => {
        try {
           const response = await fetch('/api/proxy', {
  method: 'POST',
  body: JSON.stringify({
    endpoint: 'top-headlines',
    params: { category: 'technology', pageSize: limit }
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
     * @param {string} category - Category slug
     * @param {number} page - Page number
     * @param {number} perPage - Articles per page
     * @returns {Promise} - Promise with articles data
     */
    getArticlesByCategory: async (category, page = 1, perPage = 10) => {
        try {
            const newsApiCategory = categoryMap[category] || 'technology';
            const response = await fetch(
                `${API_BASE_URL}${API_ENDPOINTS.topHeadlines}?category=${newsApiCategory}&page=${page}&pageSize=${perPage}`,
                { headers: getHeaders() }
            );
            if (!response.ok) throw new Error(`Failed to fetch ${category} articles`);
            const data = await response.json();
            return data.articles.map(article => formatArticle(article, category));
        } catch (error) {
            handleApiError(error);
        }
    },

    /**
     * Search articles
     * @param {string} query - Search query
     * @param {number} page - Page number
     * @param {number} perPage - Results per page
     * @returns {Promise} - Promise with search results
     */
    searchArticles: async (query, page = 1, perPage = 10) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}${API_ENDPOINTS.everything}?q=${encodeURIComponent(query)}&page=${page}&pageSize=${perPage}&sortBy=publishedAt`,
                { headers: getHeaders() }
            );
            if (!response.ok) throw new Error('Search failed');
            const data = await response.json();
            return data.articles.map(article => formatArticle(article, 'Search'));
        } catch (error) {
            handleApiError(error);
        }
    }
};

/**
 * Format NewsAPI article to our expected format
 */
const formatArticle = (article, category) => {
    return {
        id: article.url, // Using URL as ID since NewsAPI doesn't provide IDs
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
        image: article.urlToImage || 'https://source.unsplash.com/random/600x400/?' + category.toLowerCase(),
        source: article.source.name,
        url: article.url
    };
};

// Frontend integration remains the same as before
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the page with featured articles
    ApiService.getFeaturedArticles()
        .then(articles => {
            console.log('Featured articles:', articles);
            // Render articles to the DOM
            renderFeaturedArticles(articles);
        })
        .catch(error => {
            console.error('Error loading featured articles:', error);
            showError('Failed to load featured articles');
        });

    // Search functionality
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }

    function handleSearch() {
        const query = searchInput.value.trim();
        if (query) {
            ApiService.searchArticles(query)
                .then(results => {
                    console.log('Search results:', results);
                    renderSearchResults(results);
                })
                .catch(error => {
                    console.error('Search error:', error);
                    showError('Search failed. Please try again.');
                });
        }
    }

    // Category tab switching
    const categoryTabs = document.querySelectorAll('.category-tab');
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.textContent.trim();
            ApiService.getArticlesByCategory(category)
                .then(articles => {
                    console.log(`${category} articles:`, articles);
                    renderCategoryArticles(articles, category);
                })
                .catch(error => {
                    console.error(`Error loading ${category} articles:`, error);
                    showError(`Failed to load ${category} articles`);
                });
        });
    });
});

// Example rendering functions (you'll need to implement these)
function renderFeaturedArticles(articles) {
    // Implementation depends on your HTML structure
    const featuredGrid = document.querySelector('.featured-grid');
    if (featuredGrid) {
        featuredGrid.innerHTML = articles.map(article => `
            <article class="featured-article">
                <div class="article-image" style="background-image: url('${article.image}')">
                    <span class="article-category">${article.category}</span>
                </div>
                <div class="article-content">
                    <h3 class="article-title">
                        <a href="${article.url}" target="_blank">${article.title}</a>
                    </h3>
                    <p class="article-excerpt">${article.excerpt}</p>
                    <div class="article-meta">
                        <span>${article.date}</span>
                        <span>By ${article.author}</span>
                    </div>
                </div>
            </article>
        `).join('');
    }
}

function showError(message) {
    // Display error message to user
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    document.body.prepend(errorElement);
    setTimeout(() => errorElement.remove(), 5000);
}
