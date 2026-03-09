// AnimeVerse - JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // 1. Mobile Menu Toggle
    // ============================================
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    
    // Create hamburger menu for mobile
    function createMobileMenu() {
        const hamburger = document.createElement('button');
        hamburger.classList.add('hamburger');
        hamburger.innerHTML = '☰';
        hamburger.setAttribute('aria-label', 'Toggle menu');
        
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
        });
        
        navbar.insertBefore(hamburger, navLinks);
    }
    
    // Add hamburger menu on mobile screens
    function checkMobileMenu() {
        if (window.innerWidth <= 768) {
            if (!document.querySelector('.hamburger')) {
                createMobileMenu();
            }
        } else {
            const hamburger = document.querySelector('.hamburger');
            if (hamburger) {
                hamburger.remove();
            }
            navLinks.classList.remove('active');
        }
    }
    
    // Initialize mobile menu
    checkMobileMenu();
    window.addEventListener('resize', checkMobileMenu);
    
    // ============================================
    // 2. Button Click Animation
    // ============================================
    const buttons = document.querySelectorAll('.btn-primary, .read-more');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple effect CSS dynamically
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // ============================================
    // 3. Welcome Popup on Page Load
    // ============================================
    function showWelcomePopup() {
        // Check if user has seen the popup before
        if (localStorage.getItem('animeverse-welcome-seen')) {
            return;
        }
        
        const popup = document.createElement('div');
        popup.classList.add('welcome-popup');
        popup.innerHTML = `
            <div class="popup-content">
                <h2>Welcome to AnimeVerse! 🎌</h2>
                <p>Explore the best anime reviews, news, and top lists.</p>
                <button class="popup-close">Got it!</button>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Close popup functionality
        const closeBtn = popup.querySelector('.popup-close');
        closeBtn.addEventListener('click', function() {
            popup.classList.add('close');
            setTimeout(() => {
                popup.remove();
                localStorage.setItem('animeverse-welcome-seen', 'true');
            }, 300);
        });
        
        // Close on background click
        popup.addEventListener('click', function(e) {
            if (e.target === popup) {
                closeBtn.click();
            }
        });
    }
    
    // Show popup after a short delay
    setTimeout(showWelcomePopup, 1000);
    
    // ============================================
    // 4. Search Function to Filter Articles
    // ============================================
    function initSearchFunction() {
        // Create search bar
        const searchContainer = document.createElement('div');
        searchContainer.classList.add('search-container');
        searchContainer.innerHTML = `
            <input type="text" id="search-input" placeholder="Search anime articles...">
            <button id="search-btn">🔍</button>
        `;
        
        // Insert search bar before the card grid
        const cardGrid = document.querySelector('.card-grid');
        if (cardGrid) {
            cardGrid.parentNode.insertBefore(searchContainer, cardGrid);
        }
        
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        const cards = document.querySelectorAll('.card');
        
        // Search function
        function filterArticles() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            cards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Show message if no results
            const visibleCards = document.querySelectorAll('.card-grid .card[style*="display: block"]');
            const noResults = document.querySelector('.no-results');
            
            if (visibleCards.length === 0 && searchTerm.length > 0) {
                if (!noResults) {
                    const message = document.createElement('p');
                    message.classList.add('no-results');
                    message.textContent = 'No articles found matching your search.';
                    message.style.textAlign = 'center';
                    message.style.color = '#b3b3b3';
                    message.style.marginTop = '2rem';
                    cardGrid.parentNode.insertBefore(message, cardGrid);
                }
            } else if (noResults && visibleCards.length > 0) {
                noResults.remove();
            }
        }
        
        // Add event listeners
        searchInput.addEventListener('input', filterArticles);
        searchBtn.addEventListener('click', filterArticles);
        
        // Add search animation CSS
        const searchStyle = document.createElement('style');
        searchStyle.textContent = `
            .search-container {
                display: flex;
                justify-content: center;
                margin-bottom: 2rem;
                gap: 10px;
            }
            
            #search-input {
                padding: 12px 20px;
                width: 300px;
                max-width: 100%;
                border: 2px solid #333;
                border-radius: 25px;
                background: #1a1a20;
                color: white;
                font-size: 1rem;
                outline: none;
                transition: 0.3s;
            }
            
            #search-input:focus {
                border-color: var(--accent-color);
                box-shadow: 0 0 10px rgba(112, 0, 255, 0.3);
            }
            
            #search-btn {
                padding: 12px 20px;
                background: var(--accent-color);
                border: none;
                border-radius: 25px;
                color: white;
                cursor: pointer;
                transition: 0.3s;
            }
            
            #search-btn:hover {
                background: var(--accent-glow);
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(searchStyle);
    }
    
    initSearchFunction();
    
    // ============================================
    // 5. Smooth Scrolling Navigation
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu after clicking
                const navLinks = document.querySelector('.nav-links');
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const hamburger = document.querySelector('.hamburger');
                    if (hamburger) {
                        hamburger.innerHTML = '☰';
                    }
                }
            }
        });
    });
    
    // ============================================
    // Additional Features
    // ============================================
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Card hover effect enhancement
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.borderColor = 'var(--accent-color)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.borderColor = '#333';
        });
    });
    
    // Console welcome message
    console.log('%c🎌 Welcome to AnimeVerse! 🎌', 'color: #7000ff; font-size: 20px; font-weight: bold;');
    console.log('Explore the best anime content on the web!');
    
});