// api.js - API handling for TechTrends website

// Base API URL (this would be your backend endpoint)
const API_BASE_URL = 'https://api.techtrends.example.com/v1';

// API endpoints
const API_ENDPOINTS = {
    articles: '/articles',
    featured: '/articles/featured',
    categories: '/categories',
    search: '/search',
    articleDetail: (id) => `/articles/${id}`,
    relatedArticles: (id) => `/articles/${id}/related`
};

// Common headers for API requests
const getHeaders = () => {
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
};

// Handle API errors
const handleApiError = (error) => {
    console.error('API Error:', error);
    throw error;
};

// API Service
const ApiService = {
    /**
     * Fetch featured articles
     * @param {number} limit - Number of articles to fetch
     * @returns {Promise} - Promise with featured articles data
     */
    getFeaturedArticles: async (limit = 3) => {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.featured}?limit=${limit}`, {
                headers: getHeaders()
            });
            if (!response.ok) throw new Error('Failed to fetch featured articles');
            return await response.json();
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
            const response = await fetch(
                `${API_BASE_URL}${API_ENDPOINTS.articles}?category=${category}&page=${page}&per_page=${perPage}`,
                { headers: getHeaders() }
            );
            if (!response.ok) throw new Error(`Failed to fetch ${category} articles`);
            return await response.json();
        } catch (error) {
            handleApiError(error);
        }
    },

    /**
     * Fetch article by ID
     * @param {string} id - Article ID
     * @returns {Promise} - Promise with article data
     */
    getArticleById: async (id) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}${API_ENDPOINTS.articleDetail(id)}`,
                { headers: getHeaders() }
            );
            if (!response.ok) throw new Error('Failed to fetch article');
            return await response.json();
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
                `${API_BASE_URL}${API_ENDPOINTS.search}?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`,
                { headers: getHeaders() }
            );
            if (!response.ok) throw new Error('Search failed');
            return await response.json();
        } catch (error) {
            handleApiError(error);
        }
    },

    /**
     * Fetch related articles
     * @param {string} articleId - Original article ID
     * @param {number} limit - Number of related articles to fetch
     * @returns {Promise} - Promise with related articles
     */
    getRelatedArticles: async (articleId, limit = 4) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}${API_ENDPOINTS.relatedArticles(articleId)}?limit=${limit}`,
                { headers: getHeaders() }
            );
            if (!response.ok) throw new Error('Failed to fetch related articles');
            return await response.json();
        } catch (error) {
            handleApiError(error);
        }
    },

    /**
     * Fetch all categories
     * @returns {Promise} - Promise with categories data
     */
    getCategories: async () => {
        try {
            const response = await fetch(
                `${API_BASE_URL}${API_ENDPOINTS.categories}`,
                { headers: getHeaders() }
            );
            if (!response.ok) throw new Error('Failed to fetch categories');
            return await response.json();
        } catch (error) {
            handleApiError(error);
        }
    }
};

// Example usage:
// ApiService.getFeaturedArticles().then(data => console.log(data));
// ApiService.getArticleById('123').then(data => console.log(data));

// For the frontend integration, you would add event listeners and DOM manipulation code
// to fetch and display data when the page loads or when users interact with the UI.

// Frontend integration example (could be in a separate file or at the bottom of this one)
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the page with featured articles
    ApiService.getFeaturedArticles()
        .then(articles => {
            // Render articles to the DOM
            console.log('Featured articles:', articles);
            // You would have a function here to update the DOM with the articles
        })
        .catch(error => {
            console.error('Error loading featured articles:', error);
            // Show error message to user
        });

    // Search functionality
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                ApiService.searchArticles(query)
                    .then(results => {
                        console.log('Search results:', results);
                        // Update the DOM with search results
                        // You might want to hide other content and show search results
                    })
                    .catch(error => {
                        console.error('Search error:', error);
                        // Show error message to user
                    });
            }
        });
        
        // Also allow search on Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
    }

    // Category tab switching
    const categoryTabs = document.querySelectorAll('.category-tab');
    if (categoryTabs.length > 0) {
        // The first tab is "Latest News" which would fetch all articles
        categoryTabs[0].addEventListener('click', () => {
            ApiService.getArticlesByCategory('all')
                .then(articles => {
                    console.log('Latest articles:', articles);
                    // Update the DOM with latest articles
                })
                .catch(error => {
                    console.error('Error loading latest articles:', error);
                });
        });

        // Other category tabs would fetch articles by specific category
        // You would need to map the tab text to category slugs
        const categoryMap = {
            'AI & Machine Learning': 'ai-ml',
            'Programming': 'programming',
            'Gadgets': 'gadgets',
            'Security': 'security'
        };

        categoryTabs.forEach((tab, index) => {
            if (index > 0) { // Skip the first tab which we already handled
                tab.addEventListener('click', () => {
                    const categoryName = tab.textContent.trim();
                    const categorySlug = categoryMap[categoryName];
                    
                    if (categorySlug) {
                        ApiService.getArticlesByCategory(categorySlug)
                            .then(articles => {
                                console.log(`${categoryName} articles:`, articles);
                                // Update the DOM with category articles
                            })
                            .catch(error => {
                                console.error(`Error loading ${categoryName} articles:`, error);
                            });
                    }
                });
            }
        });
    }
});
