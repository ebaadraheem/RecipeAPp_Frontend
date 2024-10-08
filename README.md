RecipeApp Frontend Welcome to the RecipeApp frontend repository!
This is the client-side application built using React Native with Expo. This README will guide you through the setup, configuration, and usage of the frontend application.
Table of Contents 
Features
Getting Started 
Configuration
Running the Application 
Running Tests
Deployment
Contributing License Features
User Authentication: Sign up and log in using Firebase.
Recipe Management: View and manage recipes from the backend.
Favorites: Mark recipes as favorites and view them. 
Image Upload: Upload images related to recipes.
Getting Started Prerequisites Node.js (v14 or later) npm (v6 or later) or yarn Expo CLI Installation
Clone the repository: bash Copy code git clone https://github.com/ebaadraheem/RecipeApp_Frontend.git cd recipeapp-frontend 
Install dependencies: bash Copy code npm install # or yarn install Install Expo CLI globally (if not already installed): bash Copy code npm install -g expo-cli Configuration
Create a .env file in the root directory with the following content: env Copy code # Backend Server URL SERVER_URL=https://your-backend-url.com # Firebase Configuration FIREBASE_API_KEY=your-firebase-api-key Environment Variables 
Explained SERVER_URL: The URL of your backend server where the React Native app will send API requests. 
FIREBASE_API_KEY: Your Firebase API key for authenticating with Firebase services. Running the Application 
To start the development server and run the application on your device or emulator: bash Copy code npm start # or yarn start This will open the Expo Developer Tools in your browser.
Follow the instructions to open the app on an Android/iOS device or emulator.
Note: Its backend server repository is named as RecipeApp_Backend in the repository section.
