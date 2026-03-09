// AnimeVerse - Frontend JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // 1. API Configuration
    // ============================================
    const API_URL = 'http://localhost:3000';
    
    // ============================================
    // 2. Load Articles from API
    // ============================================
    async function loadArticles() {
        const loading = document.getElementById('loading');
        const articlesGrid = document.getElementById('articles-grid');
        
        try {
            loading.style.display = 'block';
            articlesGrid.innerHTML = '';
            
            const response = await fetch(`${API_URL}/posts?limit=6`);
            const data = await response.json();
            
            if (data.success) {
                displayArticles(data.data);
            } else {
                articlesGrid.innerHTML = '<p class="no-results">Failed to load articles</p>';
            }
        } catch (error) {
            console.error('Error loading articles:', error);
            articlesGrid.innerHTML = '<p class="no-results">Error loading articles. Please try again later.</p>';
        } finally {
            loading.style.display = 'none';
        }
    }
    
    // Display articles in the grid
    function displayArticles(articles) {
        const articlesGrid = document.getElementById('articles-grid');
        
        if (articles.length === 0) {
            articlesGrid.innerHTML = '<p class="no-results">No articles found</p>';
            return;
        }
        
        articles.forEach(article => {
            const card = document.createElement('article');
            card.classList.add('card');
            card.innerHTML = `
                <div class="card-image" style="background-image: url('${article.image || 'https://via.placeholder.com/400x200/7000ff/ffffff?text=Anime'}')"></div>
                <div class="card-content">
                    <h3>${article.title}</h3>
                    <p>${article.content.substring(0, 150)}...</p>
                    <div class="meta">
                        <span class="author">By ${article.author}</span>
                        <span class="date">${new Date(article.date).toLocaleDateString()}</span>
                    </div>
                    <a href="#" class="read-more">Read Article &rarr;</a>
                </div>
            `;
            articlesGrid.appendChild(card);
        });
    }
    
    // ============================================
    // 3. Search Function
    // ============================================
    function initSearchFunction() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        const articlesGrid = document.getElementById('articles-grid');
        const noResults = document.getElementById('no-results');
        
        async function searchArticles() {
            const searchTerm = searchInput.value.trim();
            
            if (!searchTerm) {
                loadArticles();
                return;
            }
            
            try {
                const response = await fetch(`${API_URL}/posts/search?q=${encodeURIComponent(searchTerm)}`);
                const data = await response.json();
                
                if (data.success) {
                    displayArticles(data.data);
                    noResults.style.display = data.data.length === 0 ? 'block' : 'none';
                }
            } catch (error) {
                console.error('Error searching:', error);
            }
        }
        
        searchBtn.addEventListener('click', searchArticles);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchArticles();
            }
        });
    }
    
    // ============================================
    // 4. Welcome Popup
    // ============================================
    function showWelcomePopup() {