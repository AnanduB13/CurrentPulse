document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const newsGrid = document.getElementById('news-grid');
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');
    const categoryList = document.getElementById('category-list');
    const currentCategoryTitle = document.getElementById('current-category-title');
    const currentYearSpan = document.getElementById('current-year');

    // --- CONFIGURATION ---
    const API_KEY = '4601177f2e54479592ac696b61365152'; // NewsAPI key
    const BASE_API_URL = 'https://newsapi.org/v2/top-headlines';
    const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/'; // CORS proxy for development
    const DEFAULT_COUNTRY = 'us'; // Or change to your preferred country code
    const PAGE_SIZE = 21; // How many articles per page/category
    const USE_MOCK_DATA = true; // Set to false when you have a working API setup

    const CATEGORIES = [ // Categories supported by NewsAPI's top-headlines endpoint
        'general', 'business', 'technology', 'entertainment', 'sports', 'health', 'science'
    ];
    let currentCategory = 'general'; // Default category

    // --- MOCK DATA FOR DEMONSTRATION ---
    const getMockArticles = (category) => {
        const mockData = {
            general: [
                {
                    title: "Breaking News: Major Technology Conference Announces Revolutionary AI Developments",
                    description: "Industry leaders gather to discuss the future of artificial intelligence and its impact on society. New breakthroughs in machine learning promise to transform various sectors.",
                    url: "#",
                    urlToImage: null, // Will use CSS placeholder
                    publishedAt: new Date().toISOString(),
                    source: { name: "Tech Today" }
                },
                {
                    title: "Global Climate Summit Reaches Historic Agreement on Carbon Emissions",
                    description: "World leaders sign landmark accord to reduce greenhouse gas emissions by 50% over the next decade. Environmental experts praise the comprehensive approach.",
                    url: "#",
                    urlToImage: null, // Will use CSS placeholder
                    publishedAt: new Date(Date.now() - 86400000).toISOString(),
                    source: { name: "Global News Network" }
                },
                {
                    title: "Stock Markets Show Strong Recovery Amid Economic Optimism",
                    description: "Major indices post significant gains as investors respond positively to improved economic indicators and corporate earnings reports.",
                    url: "#",
                    urlToImage: null, // Will use CSS placeholder
                    publishedAt: new Date(Date.now() - 172800000).toISOString(),
                    source: { name: "Financial Times" }
                }
            ],
            business: [
                {
                    title: "Startup Unicorn Raises $500M in Series C Funding Round",
                    description: "The fintech company plans to expand globally and develop new products for emerging markets. Investors show strong confidence in the business model.",
                    url: "#",
                    urlToImage: null, // Will use CSS placeholder
                    publishedAt: new Date().toISOString(),
                    source: { name: "Business Weekly" }
                },
                {
                    title: "Major Retail Chain Announces Expansion Plans for 2025",
                    description: "The company will open 200 new stores across emerging markets, creating thousands of jobs and strengthening its global presence.",
                    url: "#",
                    urlToImage: null, // Will use CSS placeholder
                    publishedAt: new Date(Date.now() - 86400000).toISOString(),
                    source: { name: "Retail Insider" }
                }
            ],
            technology: [
                {
                    title: "New Quantum Computing Breakthrough Could Revolutionize Cybersecurity",
                    description: "Researchers develop quantum-resistant encryption methods that could protect data against future quantum computer attacks.",
                    url: "#",
                    urlToImage: null, // Will use CSS placeholder
                    publishedAt: new Date().toISOString(),
                    source: { name: "TechCrunch" }
                },
                {
                    title: "Major Tech Company Unveils Next-Generation Smartphone with Advanced AI Features",
                    description: "The device features improved camera capabilities, longer battery life, and enhanced user experience powered by machine learning.",
                    url: "#",
                    urlToImage: null, // Will use CSS placeholder
                    publishedAt: new Date(Date.now() - 172800000).toISOString(),
                    source: { name: "Mobile Tech Review" }
                }
            ],
            entertainment: [
                {
                    title: "Award-Winning Director Announces New Science Fiction Epic",
                    description: "The highly anticipated film will feature cutting-edge visual effects and an all-star cast. Production begins next year with a projected 2026 release.",
                    url: "#",
                    urlToImage: null, // Will use CSS placeholder
                    publishedAt: new Date().toISOString(),
                    source: { name: "Entertainment Weekly" }
                }
            ],
            sports: [
                {
                    title: "Championship Finals Draw Record Viewership Numbers",
                    description: "The thrilling match captivated audiences worldwide, with social media engagement reaching unprecedented levels throughout the tournament.",
                    url: "#",
                    urlToImage: null, // Will use CSS placeholder
                    publishedAt: new Date().toISOString(),
                    source: { name: "Sports Central" }
                }
            ],
            health: [
                {
                    title: "New Study Reveals Benefits of Regular Exercise on Mental Health",
                    description: "Researchers find that consistent physical activity can significantly reduce symptoms of anxiety and depression while improving cognitive function.",
                    url: "#",
                    urlToImage: null, // Will use CSS placeholder
                    publishedAt: new Date().toISOString(),
                    source: { name: "Medical Journal" }
                }
            ],
            science: [
                {
                    title: "Space Mission Successfully Lands on Mars, Begins Sample Collection",
                    description: "The robotic explorer has begun its mission to search for signs of ancient life and collect geological samples for future return to Earth.",
                    url: "#",
                    urlToImage: null, // Will use CSS placeholder
                    publishedAt: new Date().toISOString(),
                    source: { name: "Space Today" }
                }
            ]
        };
        
        return mockData[category] || mockData.general;
    };

    // --- Initial Setup ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Helper Functions ---
    const showLoading = () => {
        loadingIndicator?.classList.remove('hidden');
        newsGrid?.classList.add('hidden');
        errorMessage?.classList.add('hidden');
        newsGrid.innerHTML = ''; // Clear grid while loading
    };

    const hideLoading = () => {
        loadingIndicator?.classList.add('hidden');
        newsGrid?.classList.remove('hidden');
    };

    const showError = (message = "Failed to load news.") => {
        hideLoading(); // Hide loading indicator first
        newsGrid?.classList.add('hidden'); // Keep grid hidden
        if (errorMessage) {
            errorMessage.querySelector('p').textContent = message;
            errorMessage.classList.remove('hidden');
        }
        console.error("News Fetch Error:", message);
    };

    const formatDate = (isoString) => {
        if (!isoString) return 'Date unavailable';
        try {
            const date = new Date(isoString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            });
        } catch (e) {
            console.error("Error formatting date:", isoString, e);
            return 'Invalid Date';
        }
    };

    // Capitalize first letter for titles
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // --- Category Functions ---
    const createCategoryButtons = () => {
        if (!categoryList) return;
        categoryList.innerHTML = ''; // Clear existing (like the default General button)

        CATEGORIES.forEach(category => {
            const listItem = document.createElement('li');
            const button = document.createElement('button');
            button.className = 'category-button';
            button.textContent = capitalizeFirstLetter(category);
            button.dataset.category = category; // Store category name in data attribute

            if (category === currentCategory) {
                button.classList.add('active-category'); // Set initial active button
            }

            button.addEventListener('click', handleCategoryClick);
            listItem.appendChild(button);
            categoryList.appendChild(listItem);
        });
    };

    const handleCategoryClick = (event) => {
        const newCategory = event.target.dataset.category;
        if (newCategory === currentCategory || !newCategory) {
            return; // Do nothing if same category clicked or button has no category
        }

        currentCategory = newCategory;

        // Update active button style
        document.querySelectorAll('.category-button').forEach(btn => {
            btn.classList.remove('active-category');
        });
        event.target.classList.add('active-category');

        // Update the title
        if (currentCategoryTitle) {
            currentCategoryTitle.textContent = `${capitalizeFirstLetter(currentCategory)} News`;
        }

        // Fetch news for the new category
        fetchNews();
    };

    // --- Main Fetch Function ---
    const fetchNews = async () => {
        showLoading();

        // Use mock data if enabled
        if (USE_MOCK_DATA) {
            // Simulate network delay for realistic experience
            setTimeout(() => {
                const mockArticles = getMockArticles(currentCategory);
                displayNews(mockArticles);
                hideLoading();
            }, 1000);
            return;
        }

        if (API_KEY === 'YOUR_API_KEY' || !API_KEY) {
             showError("API Key is missing! Please add your NewsAPI.org key to script.js.");
             return;
        }

        // Construct the URL with the current category (with CORS proxy for development)
        const url = `${CORS_PROXY}${BASE_API_URL}?country=${DEFAULT_COUNTRY}&category=${currentCategory}&pageSize=${PAGE_SIZE}&apiKey=${API_KEY}`;

        try {
            const response = await fetch(url, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest', // Required by some CORS proxies
                }
            });
            
            if (!response.ok) {
                let errorData = { message: `HTTP error! Status: ${response.status}` };
                try { // Try to get more specific error from API response body
                  errorData = await response.json();
                } catch (e) { /* Ignore if response not json */ }
                throw new Error(errorData.message || `Failed to fetch: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.status !== 'ok') {
                throw new Error(data.message || 'API response status was not "ok".');
            }

            displayNews(data.articles);
            hideLoading();

        } catch (error) {
             console.error('Error fetching or processing news:', error);
             // If real API fails, fall back to mock data
             console.log('Falling back to mock data...');
             const mockArticles = getMockArticles(currentCategory);
             displayNews(mockArticles);
             hideLoading();
             
             // Show a subtle notice about using demo data
             const noticeElement = document.createElement('div');
             noticeElement.style.cssText = `
                 background: #e7f3ff; 
                 border: 1px solid #4a90e2; 
                 border-radius: 4px; 
                 padding: 8px 12px; 
                 margin-bottom: 16px; 
                 font-size: 0.9rem; 
                 color: #2c5282;
             `;
             noticeElement.innerHTML = '📰 <strong>Demo Mode:</strong> Showing sample news articles. For live news, configure the API properly.';
             newsGrid.parentNode.insertBefore(noticeElement, newsGrid);
        }
    };

    // --- Display News Function ---
    const displayNews = (articles) => {
        if (!newsGrid) {
            console.error("News grid container not found!");
            return;
        }
        newsGrid.innerHTML = ''; // Clear previous news

        if (!articles || articles.length === 0) {
            newsGrid.innerHTML = `<p class="no-articles">No articles found for the '${currentCategory}' category.</p>`;
            return;
        }

        articles.forEach(article => {
            if (!article.title || !article.url) return; // Skip incomplete articles

            const newsCard = document.createElement('article'); // Use <article> tag
            newsCard.classList.add('news-card');

            // Image section (wrapped in a link)
            const imageLink = document.createElement('a');
            imageLink.href = article.url;
            imageLink.target = "_blank";
            imageLink.rel = "noopener noreferrer";
            imageLink.classList.add('card-image-link');

            let imageElement;
            if (article.urlToImage) {
                imageElement = document.createElement('img');
                imageElement.src = article.urlToImage;
                imageElement.alt = ""; // Alt text handled by linked title below
                imageElement.loading = "lazy"; // Lazy load images
                imageElement.onerror = function() {
                    this.outerHTML = '<div class="placeholder-image"><span>Image<br>Not Available</span></div>';
                };
            } else {
                imageElement = document.createElement('div');
                imageElement.classList.add('placeholder-image');
                imageElement.innerHTML = '<span>Image<br>Not Available</span>'; // More descriptive placeholder
            }
            imageLink.appendChild(imageElement); // Add image/placeholder to link

            // Content Div
            const contentDiv = document.createElement('div');
            contentDiv.classList.add('news-content');

            // Title (as a link)
            const title = document.createElement('h3');
            const titleLink = document.createElement('a');
            titleLink.href = article.url;
            titleLink.textContent = article.title.length > 80 ? article.title.substring(0, 80) + '...' : article.title; // Truncate long titles
            titleLink.target = "_blank";
            titleLink.rel = "noopener noreferrer";
            title.appendChild(titleLink);

            // Meta Info
            const meta = document.createElement('div');
            meta.classList.add('meta');
            const source = document.createElement('span');
            source.classList.add('source');
            source.textContent = article.source?.name || 'Unknown Source';
            const date = document.createElement('span');
            date.classList.add('date');
            date.textContent = formatDate(article.publishedAt);
            meta.appendChild(source);
            meta.appendChild(date);

            // Description
            const description = document.createElement('p');
            description.classList.add('description');
            let descText = article.description || '';
            if (descText && descText.length > 120) {
                let limit = descText.lastIndexOf(' ', 120);
                if (limit === -1) limit = 120;
                descText = descText.substring(0, limit) + '...';
            } else if (!descText) {
                descText = "Read the full article for details.";
            }
            description.textContent = descText;

            // Read More Button (actually a link styled as a button)
            const readMoreLink = document.createElement('a');
            readMoreLink.href = article.url;
            readMoreLink.textContent = 'Read Article →';
            readMoreLink.target = "_blank";
            readMoreLink.rel = "noopener noreferrer";
            readMoreLink.classList.add('read-more');

            // Append elements
            contentDiv.appendChild(title);
            contentDiv.appendChild(meta);
            contentDiv.appendChild(description);
            contentDiv.appendChild(readMoreLink);

            newsCard.appendChild(imageLink); // Append image link first
            newsCard.appendChild(contentDiv);

            newsGrid.appendChild(newsCard);
        });
    };

    // --- Initialize ---
    createCategoryButtons(); // Create category buttons dynamically
    fetchNews(); // Fetch news for the default category on load

}); // End DOMContentLoaded