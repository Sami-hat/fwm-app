## Information
Welcome to my Grocery Management App!

This app is a food waste management tool, helping you track your groceries, discover recipes to make with them, and store everything properly.

Create an account and start scanning barcodes/taking photos/manually enter data to track your groceries. The app provides recipe recommendations based on the available food, and users can share these recipes with others via their preferred platform.

## Set up 

1. Install dependencies

   ```bash
   npm install
   ```

2a. Ammed the .env.example file to accomodate your own backend should you wish to experiment with the code

2b. Start the backend and the app concurrently, tunnel if on a secure network
   For my own testing purposes

   ```bash
   npx concurrently --raw "npm run backend" "npx expo start"
   ```

## Requirements
- Node.js 18 or later (recommended)
- npm 7 or later
