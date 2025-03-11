## Information
Welcome to our App!

The app allows users to log in or create an account. Once authenticated, they can scan barcodes or manually enter data to track their groceries. The app provides recipe recommendations based on the user's available food, and users can share these recipes with others via their preffered platform.

This project uses React Native and Expo. The frontend is made with the React Native Elements component library. See [here](https://reactnativeelements.com/) to read more about React Native Elements. The backend uses Express.js, a back end web application framework. The project utilizes various third-party APIs, with the Express server handling GET and POST requests to the relevant endpoints.

## Set up

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the backend and the app concurrently, tunnel if on a secure network

   ```bash
   npx concurrently --raw "npm run backend" "npx expo start"
   ```

## Requirements
- Node.js 18 or later (recommended)
- npm 7 or later