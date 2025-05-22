# Word Puzzle Generator

A web application that generates word search puzzles from a list of words. The puzzles can be downloaded as PNG images with a notebook-style grid and handwritten font.

## Features

- Generate word search puzzles from comma-separated words
- Download puzzles as PNG images
- Notebook-style grid background
- Handwritten font for a personal touch
- Responsive design

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Deploying to GitHub Pages

1. Make sure you have a GitHub repository set up for this project.

2. Add the following to your package.json (already included):
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Deploy to GitHub Pages:
```bash
npm run deploy
```

4. In your GitHub repository settings:
   - Go to Settings > Pages
   - Set the source to "GitHub Actions"
   - The site will be available at `https://<your-username>.github.io/puzzler/`

## Technologies Used

- React
- Vite
- Styled Components
- html2canvas
- GitHub Pages