// Anime data with real images from the internet
const animeData = [
    {
        id: 1,
        title: "Attack on Titan",
        genre: "action",
        rating: 9.0,
        year: 2013,
        episodes: 75,
        image: "https://cdn.myanimelist.net/images/anime/10/47347.jpg",
        description: "Humanity fights for survival against giant humanoid Titans.",
        status: "Completed"
    },
    {
        id: 2,
        title: "Your Name",
        genre: "romance",
        rating: 8.4,
        year: 2016,
        episodes: "Movie",
        image: "https://cdn.myanimelist.net/images/anime/5/87048.jpg",
        description: "Two teenagers share a profound, magical connection.",
        status: "Movie"
    },
    {
        id: 3,
        title: "One Piece",
        genre: "action",
        rating: 9.2,
        year: 1999,
        episodes: "1000+",
        image: "https://cdn.myanimelist.net/images/anime/6/73245.jpg",
        description: "A young pirate searches for the ultimate treasure.",
        status: "Ongoing"
    },
    {
        id: 4,
        title: "Spirited Away",
        genre: "fantasy",
        rating: 9.3,
        year: 2001,
        episodes: "Movie",
        image: "https://cdn.myanimelist.net/images/anime/6/79597.jpg",
        description: "A girl enters a world ruled by gods and witches.",
        status: "Movie"
    },
    {
        id: 6,
        title: "My Hero Academia",
        genre: "action",
        rating: 8.7,
        year: 2016,
        episodes: 130,
        image: "https://cdn.myanimelist.net/images/anime/10/78745.jpg",
        description: "In a world of superheroes, a boy dreams of becoming one.",
        status: "Ongoing"
    },

    {
        id: 8,
        title: "One Punch Man",
        genre: "comedy",
        rating: 8.8,
        year: 2015,
        episodes: 24,
        image: "https://cdn.myanimelist.net/images/anime/12/76049.jpg",
        description: "A superhero can defeat any enemy with a single punch.",
        status: "Ongoing"
    },
    {
        id: 9,
        title: "Demon Slayer",
        genre: "action",
        rating: 8.6,
        year: 2019,
        episodes: 32,
        image: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
        description: "A boy becomes a demon slayer to save his sister.",
        status: "Ongoing"
    },
    {
        id: 10,
        title: "Jujutsu Kaisen",
        genre: "action",
        rating: 8.8,
        year: 2020,
        episodes: 24,
        image: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
        description: "Students battle cursed spirits in modern Tokyo.",
        status: "Ongoing"
    },
    {
        id: 12,
        title: "Mob Psycho 100",
        genre: "comedy",
        rating: 8.9,
        year: 2016,
        episodes: 36,
        image: "https://cdn.myanimelist.net/images/anime/8/80356.jpg",
        description: "A psychic middle schooler tries to live a normal life.",
        status: "Completed"
    }
];

// Global variables
let currentFilter = 'all';
let displayedAnime = [];
let itemsToShow = 8;
let currentPage = 1;

// DOM Elements
const animeGrid = document.getElementById('animeGrid');
const searchInput = document.getElementById('searchInput');
const loadMoreBtn = document.getElementById('loadMore');
const scrollToTopBtn = document.getElementById('scrollToTop');
const mobileMenuBtn = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const loadingSpinner = document.getElementById('loadingSpinner');

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    setupEventListeners();
    displayAnime(animeData.slice(0, itemsToShow));
    animateCounters();
    setupSmoothScrolling();
}

function setupEventListeners() {
    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            handleFilterClick(this);
        });
    });

    // Search functionality
    searchInput.addEventListener('input', handleSearch);

    // Load more button
    loadMoreBtn.addEventListener('click', loadMoreAnime);

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Scroll to top button
    scrollToTopBtn.addEventListener('click', scrollToTop);

    // Window scroll event
    window.addEventListener('scroll', handleScroll);

    // Genre cards
    const genreCards = document.querySelectorAll('.genre-card');
    genreCards.forEach(card => {
        card.addEventListener('click', function() {
            const genre = this.querySelector('h3').textContent.toLowerCase();
            filterAnimeByGenre(genre);
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function handleFilterClick(button) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('bg-anime-primary', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });
    
    button.classList.remove('bg-gray-200', 'text-gray-700');
    button.classList.add('bg-anime-primary', 'text-white');

    // Filter anime
    currentFilter = button.dataset.filter;
    filterAnime();
}

function filterAnime() {
    showLoadingSpinner();
    
    setTimeout(() => {
        let filteredAnime = animeData;
        
        if (currentFilter !== 'all') {
            filteredAnime = animeData.filter(anime => 
                anime.genre.toLowerCase().includes(currentFilter.toLowerCase())
            );
        }

        currentPage = 1;
        itemsToShow = 8;
        displayAnime(filteredAnime.slice(0, itemsToShow));
        
        // Update load more button visibility
        if (filteredAnime.length <= itemsToShow) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
        
        hideLoadingSpinner();
    }, 500);
}

function filterAnimeByGenre(genre) {
    // Update filter button
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        if (btn.dataset.filter === genre || (genre === 'fantasy' && btn.dataset.filter === 'all')) {
            btn.click();
        }
    });

    // Scroll to popular section
    document.getElementById('popular').scrollIntoView({
        behavior: 'smooth'
    });
}

function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filterAnime();
        return;
    }

    showLoadingSpinner();
    
    setTimeout(() => {
        let filteredAnime = animeData.filter(anime => 
            anime.title.toLowerCase().includes(searchTerm) ||
            anime.description.toLowerCase().includes(searchTerm) ||
            anime.genre.toLowerCase().includes(searchTerm)
        );

        if (currentFilter !== 'all') {
            filteredAnime = filteredAnime.filter(anime => 
                anime.genre.toLowerCase().includes(currentFilter.toLowerCase())
            );
        }

        displayAnime(filteredAnime);
        
        // Hide load more button during search
        loadMoreBtn.style.display = 'none';
        
        hideLoadingSpinner();
    }, 300);
}

function displayAnime(animeList) {
    if (animeList.length === 0) {
        animeGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-search text-6xl text-gray-300 mb-4"></i>
                <h3 class="text-2xl font-bold text-gray-600 mb-2">No anime found</h3>
                <p class="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }

    animeGrid.innerHTML = animeList.map(anime => createAnimeCard(anime)).join('');
    
    // Add animation to cards
    setTimeout(() => {
        const cards = document.querySelectorAll('.anime-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 100);
}

function createAnimeCard(anime) {
    return `
        <div class="anime-card bg-white rounded-lg shadow-lg overflow-hidden anime-card-hover opacity-0 transform translate-y-4 transition-all duration-500" 
             data-genre="${anime.genre}" onclick="showAnimeDetails(${anime.id})">
            <div class="relative">
                <img src="${anime.image}" alt="${anime.title}" class="w-full h-64 object-cover">
                <div class="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                    ${anime.status}
                </div>
                <div class="absolute bottom-2 left-2 bg-anime-primary text-white px-2 py-1 rounded text-sm font-bold">
                    ★ ${anime.rating}
                </div>
            </div>
            <div class="p-4">
                <h3 class="font-bold text-lg mb-2 text-gray-900 line-clamp-1">${anime.title}</h3>
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">${anime.description}</p>
                <div class="flex justify-between items-center text-sm text-gray-500">
                    <span><i class="fas fa-calendar mr-1"></i>${anime.year}</span>
                    <span><i class="fas fa-play-circle mr-1"></i>${anime.episodes} ${typeof anime.episodes === 'string' ? '' : 'episodes'}</span>
                </div>
                <div class="mt-3">
                    <span class="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full capitalize">
                        ${anime.genre}
                    </span>
                </div>
            </div>
        </div>
    `;
}

function showAnimeDetails(animeId) {
    const anime = animeData.find(a => a.id === animeId);
    if (!anime) return;

    // Create modal HTML
    const modalHTML = `
        <div id="animeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
                <div class="relative">
                    <img src="${anime.image}" alt="${anime.title}" class="w-full h-64 object-cover">
                    <button onclick="closeModal()" class="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-100 transition-all">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="p-6">
                    <h2 class="text-3xl font-bold text-gray-900 mb-2">${anime.title}</h2>
                    <div class="flex items-center gap-4 mb-4 text-sm text-gray-600">
                        <span><i class="fas fa-star text-yellow-400 mr-1"></i>${anime.rating}/10</span>
                        <span><i class="fas fa-calendar mr-1"></i>${anime.year}</span>
                        <span><i class="fas fa-play-circle mr-1"></i>${anime.episodes} ${typeof anime.episodes === 'string' ? '' : 'episodes'}</span>
                        <span class="bg-gray-100 px-2 py-1 rounded capitalize">${anime.genre}</span>
                    </div>
                    <p class="text-gray-700 mb-6">${anime.description}</p>
                    <div class="flex gap-4">
                        <button class="bg-anime-primary hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                            <i class="fas fa-play mr-2"></i>Watch Now
                        </button>
                        <button class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors">
                            <i class="fas fa-plus mr-2"></i>Add to List
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('animeModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

function loadMoreAnime() {
    showLoadingSpinner();
    
    setTimeout(() => {
        currentPage++;
        const startIndex = (currentPage - 1) * 8;
        const endIndex = currentPage * 8;
        
        let filteredAnime = animeData;
        if (currentFilter !== 'all') {
            filteredAnime = animeData.filter(anime => 
                anime.genre.toLowerCase().includes(currentFilter.toLowerCase())
            );
        }
        
        const newAnime = filteredAnime.slice(startIndex, endIndex);
        const currentAnime = filteredAnime.slice(0, startIndex);
        
        displayAnime([...currentAnime, ...newAnime]);
        
        // Hide load more button if no more anime
        if (endIndex >= filteredAnime.length) {
            loadMoreBtn.style.display = 'none';
        }
        
        hideLoadingSpinner();
    }, 800);
}

function toggleMobileMenu() {
    mobileMenu.classList.toggle('hidden');
}

function handleScroll() {
    // Show/hide scroll to top button
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.remove('hidden');
    } else {
        scrollToTopBtn.classList.add('hidden');
    }

    // Add scroll effect to navigation
    const nav = document.querySelector('nav');
    if (window.pageYOffset > 50) {
        nav.classList.add('bg-opacity-95', 'backdrop-blur-sm');
    } else {
        nav.classList.remove('bg-opacity-95', 'backdrop-blur-sm');
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function showLoadingSpinner() {
    loadingSpinner.classList.remove('hidden');
}

function hideLoadingSpinner() {
    loadingSpinner.classList.add('hidden');
}

function animateCounters() {
    const counters = [
        { element: document.getElementById('animeCount'), target: 1500, suffix: '+' },
        { element: document.getElementById('movieCount'), target: 800, suffix: '+' },
        { element: document.getElementById('userCount'), target: 50, suffix: 'K+' },
        { element: document.getElementById('reviewCount'), target: 25, suffix: 'K+' }
    ];

    counters.forEach(counter => {
        let current = 0;
        const increment = counter.target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= counter.target) {
                current = counter.target;
                clearInterval(timer);
            }
            counter.element.textContent = Math.floor(current) + counter.suffix;
        }, 20);
    });
}

function setupSmoothScrolling() {
    // Add smooth scrolling behavior to the page
    document.documentElement.style.scrollBehavior = 'smooth';
}

// Newsletter subscription
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('section:nth-last-of-type(2)');
    if (newsletterForm) {
        const subscribeBtn = newsletterForm.querySelector('button');
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        
        subscribeBtn.addEventListener('click', function() {
            const email = emailInput.value.trim();
            if (email && isValidEmail(email)) {
                showNotification('Thank you for subscribing! 🎉', 'success');
                emailInput.value = '';
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 transform translate-x-full transition-transform duration-300 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    }`;
    notification.innerHTML = `
        <div class="flex items-center gap-2">
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation' : 'info'}-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(full)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to navigation links
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-1px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add click animation to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });
});

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('animeModal');
    if (modal && event.target === modal) {
        closeModal();
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('animeModal');
        if (modal) {
            closeModal();
        }
    }
});

// Lazy loading for better performance
function setupLazyLoading() {
    const images = document.querySelectorAll('img[src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('fade-in');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', setupLazyLoading);

// Add CSS for fade-in animation
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        animation: fadeIn 0.5s ease-in;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .line-clamp-1 {
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
    }
    
    .line-clamp-2 {
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
`;
document.head.appendChild(style);
