# 📰 CurrentPulse - Real-Time News Aggregator

A lightweight, responsive news aggregator that displays headlines across multiple categories. Built with pure HTML, CSS, and JavaScript for easy deployment on GitHub Pages.

## ✨ Features
- 7 news categories (General, Business, Technology, Entertainment, Sports, Health, Science)
- Mobile-first responsive design
- Clean card-based UI with hover effects
- Gradient placeholder images for visual appeal
- Error handling with fallback demo data
- Dynamic category switching
- Ready for GitHub Pages hosting

## 🚀 Live Demo

Visit the live website: [https://anandub13.github.io/CurrentPulse/](https://anandub13.github.io/CurrentPulse/)

## 🛠️ Quick Start

### Option 1: Use as Demo (Recommended)
The website works out of the box with sample news data for demonstration purposes.

1. Clone the repository:
```bash
git clone https://github.com/AnanduB13/CurrentPulse.git
cd CurrentPulse
```

2. Open `index.html` in your browser or serve it locally:
```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx http-server

# Using any other static file server
```

3. Open `http://localhost:8000` in your browser

### Option 2: Connect to Real News API
If you want to fetch real news data:

1. Get a free API key from [NewsAPI.org](https://newsapi.org/) (500 requests/day)
2. Edit `script.js`:
   - Change `USE_MOCK_DATA` from `true` to `false`
   - Replace the API key if needed (current one may have usage limits)
3. Due to CORS restrictions, you'll need to either:
   - Use a CORS proxy service (already configured)
   - Deploy to a server with backend proxy
   - Use a browser extension to disable CORS for testing

## 🔧 Configuration

In `script.js`, you can customize:
- `USE_MOCK_DATA`: Set to `false` to use real API data
- `API_KEY`: Your NewsAPI.org API key
- `DEFAULT_COUNTRY`: Country code for news (default: 'us')
- `PAGE_SIZE`: Number of articles per category

## 📱 Mobile Responsive
The website is fully responsive and works great on:
- Desktop computers
- Tablets
- Mobile phones

## 🎨 Customization
- Edit `style.css` to change colors, fonts, and layout
- Modify `script.js` to add more categories or change behavior
- Update `index.html` for structure changes

## 🚀 GitHub Pages Deployment
This repository is configured for automatic GitHub Pages deployment:

1. Go to your repository Settings
2. Navigate to Pages section
3. Set Source to "GitHub Actions"
4. The site will auto-deploy on every push to main/master branch

## 📄 License
This project is open source and available under the MIT License.

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first.

## ⚠️ Note
The demo mode uses sample data for demonstration. For live news, configure with a valid NewsAPI key and handle CORS appropriately.
