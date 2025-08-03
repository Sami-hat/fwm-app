# ShopTracker - Grocery Management App

A comprehensive food waste management solution that helps you track groceries, discover recipes, and reduce food waste through smart inventory management

## Features

### Core Functionality
- **Multi-method Item Entry**: Add groceries by scanning barcodes, taking photos with AI recognition, or manual entry
- **Smart Inventory Management**: Track quantities, edit items, and manage your grocery list efficiently
- **AI-Powered Recipe Suggestions**: Get personalised recipe recommendations based on your available ingredients
- **Dietary Preferences**: Customise recipes based on dietary restrictions (vegan, vegetarian, gluten-free, etc.)
- **Recipe Sharing**: Share recipes via your preferred platform as text files

### Advanced Scanning
- **Barcode Scanner**: Integrated with multiple databases (OpenFoodFacts, UPCItemDB) for comprehensive product recognition
- **Image Recognition**: LogMeal API integration for food identification from photos
- **Multi-Database Lookup**: Fallback system across multiple barcode databases for better product coverage

### User Management
- **Secure Authentication**: Email/password signup and login (or OAuth) system
- **Personalised Experience**: User-specific inventory and preferences
- **Preference Management**: Detailed dietary preference settings that influence recipe generation

## Project Structure

```
components/            # Reusable UI components
   Header.js           # App header component
   Tabs.js             # Main tab navigation
pages/                 # Screen components
   ProfilePage.js      # Main profile and recipe suggestions
   EntriesPage.js      # Inventory management
   CameraPage.js       # Photo capture and processing
   ScannerPage.js      # Barcode scanning
   RecipePage.js       # Recipe display and sharing
   PreferencesPage.js  # Dietary preferences
   LoginPage.js        # User authentication
   SignUpPage.js       # User registration
services/              # API service layer
   apiService.js       # Centralised API calls
config/                # Configuration files
   api.js              # API endpoints and URL management
styles/                # Component-specific styles
assets/                # Images and static files
```

## Setup Instructions

### Prerequisites
- Node.js 18 or later
- npm 7 or later
- Expo CLI (install with `npm install -g @expo/cli`)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your backend URL:
   ```
   EXPO_PUBLIC_API_URL=https://your-backend-url
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

### Development with Backend
If you're running a local backend:
```bash
npx concurrently --raw "npm run backend" "npx expo start"
```

## Usage Guide

### Getting Started
1. **Create Account**: Sign up with email and password
2. **Set Preferences**: Configure dietary restrictions and preferences
3. **Add Groceries**: Use barcode scanning, photo capture, or manual entry

### Adding Items
- **Barcode Scan**: Point camera at product barcode for automatic detection
- **Photo Recognition**: Take a photo of food items for AI identification
- **Manual Entry**: Add items with name, quantity, and optional barcode

### Recipe Discovery
- View AI-generated recipes based on your current inventory
- Recipes automatically respect your dietary preferences
- Share recipes as text files to any app

### Inventory Management
- View all your groceries in an organised list
- Edit quantities and details
- Delete items when consumed

## License

MIT License - see [LICENSE](LICENSE) file for details.
