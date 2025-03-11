## Information
Welcome to our App!

The app allows users to log in or create an account. Once authenticated, they can scan barcodes or manually enter data to track their groceries. The app provides recipe recommendations based on the user's available food, and users can share these recipes with others via their preffered platform.

This project uses React Native and Expo. The frontend is made with the React Native Elements component library. See [here](https://reactnativeelements.com/) to read more about React Native Elements. The backend uses Express.js, a back end web application framework. The project utilizes various third-party APIs, with the Express server handling GET and POST requests to the relevant endpoints.

## Set up

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the backend and the app concurrently

   ```bash
   npx concurrently --raw "npm run backend" "npx expo start"
   ```

   Note that since Eduroam is a private network, the command has to become

   ```bash
   npx concurrently --raw "npm run backend" "npx expo start --tunnel"
   ```

3. Set the IP addreess
   Put the IP address into the YourIP variable within App.js. Enter only the IP address, not the full link. For example, if your IP is: bash Copy Edit

   ```bash
   127.0.0.1
   ```

   you should set App.js to

   ```bash
   const YourIP = "127.0.0.1"
   ```


## Requirements
- Node.js 18 or later (recommended)
- npm 7 or later