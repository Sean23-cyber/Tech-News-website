// scripts.js
document.addEventListener('DOMContentLoaded', function() {
    // TEMPORARY API KEY - REPLACE WITH PROPER SOLUTION FOR PRODUCTION
    const apiKey = "YOUR_API_KEY_HERE"; 
    const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?category=technology&apiKey=${apiKey}`;
    
    // Fetch tech news from NewsAPI
    async function fetchTechNews() {
        try {
            const response = await fetch(NEWS_API_URL);
            const data = await response.json();
            
            if(data.status === 'ok' && data.articles.length > 0) {
                displayNews(data.articles);
            } else {
                console.error('No articles found or API error');
                // Fallback to our placeholder content
            }
        } catch (error) {
            console.error('Error fetching news:', error);
            // Fallback to our placeholder content
        }
    }
    
    // Display news articles
    function displayNews(articles) {
        const newsGrid = document.querySelector('.news-grid');
        if (!newsGrid) return;
        
        // Clear existing placeholder content
        newsGrid.innerHTML = '';
        
        // Display up to 6 articles
        articles.slice(0, 6).forEach(article => {
            const category = getCategoryFromTitle(article.title);
            
            const newsCard = document.createElement('article');
            newsCard.className = 'news-card';
            newsCard.innerHTML = `
                <div class="news-img">
                    <img src="${article.urlToImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'}" alt="${article.title}">
                </div>
                <div class="news-content">
                    <span class="news-category ${category.class}">${category.name}</span>
                    <h3 class="news-title">${article.title}</h3>
                    <p class="news-excerpt">${article.description || 'No description available.'}</p>
                    <div class="news-meta">
                        <span>${new Date(article.publishedAt).toLocaleDateString()}</span>
                        <span>${estimateReadTime(article.content)} min read</span>
                    </div>
                </div>
            `;
            
            // Make card clickable
            newsCard.addEventListener('click', () => {
                window.open(article.url, '_blank');
            });
            
            newsGrid.appendChild(newsCard);
        });
    }
    
    // Categorize articles based on keywords
    function getCategoryFromTitle(title) {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('ai') || lowerTitle.includes('artificial intelligence') || lowerTitle.includes('machine learning')) {
            return { name: 'AI', class: 'ai' };
        } else if (lowerTitle.includes('hack') || lowerTitle.includes('cyber') || lowerTitle.includes('security')) {
            return { name: 'Cybersecurity', class: 'cyber' };
        } else if (lowerTitle.includes('code') || lowerTitle.includes('program') || lowerTitle.includes('developer')) {
            return { name: 'Programming', class: 'dev' };
        } else if (lowerTitle.includes('phone') || lowerTitle.includes('device') || lowerTitle.includes('gadget')) {
            return { name: 'Gadgets', class: '' };
        }
        return { name: 'Tech', class: '' };
    }
    
    // Estimate read time
    function estimateReadTime(content) {
        if (!content) return 3;
        const wordCount = content.split(' ').length;
        return Math.max(1, Math.round(wordCount / 200));
    }
    
    // Initialize
    fetchTechNews();
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input').value;
            
            // In a real implementation, you would send this to your backend
            console.log('Subscribed email:', email);
            alert(`Thanks for subscribing with ${email}! You'll receive our next newsletter.`);
            
            this.querySelector('input').value = '';
        });
    }
    
    // Mobile menu toggle
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    mobileMenuBtn.addEventListener('click', function() {
        document.querySelector('nav ul').classList.toggle('show');
    });
    
    const headerContainer = document.querySelector('.header-container');
    if (headerContainer) {
        headerContainer.appendChild(mobileMenuBtn);
    }
});
