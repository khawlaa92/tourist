# 🧭 TourAssist AI - React Native Mobile App

A modern, clean, and user-friendly mobile application built with React Native (Expo) for exploring Tunisia with AI-powered guidance.

## ✨ Features

- 🎨 **Beautiful Red & White Theme** - Inspired by Tunisia flag
- 🌗 **Dark Mode & Light Mode** - Toggle theme switch
- 🔐 **Authentication Screen** - Login with validation
- 💬 **AI Chat Assistant** - Real-time conversations with hardcoded AI responses
- 🗺️ **Interactive Map** - Explore featured locations in Tunisia
- 📍 **Location Discovery** - Browse 5 featured Tunisian destinations
- ✅ **Smooth Animations** - Clean transitions and button animations
- 📱 **Responsive Design** - Works perfectly on iPhone and iPad

---

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Stack Navigator)
- **State Management**: Context API (Dark Mode)
- **Maps**: react-native-maps
- **Location**: expo-location
- **UI Components**: Custom reusable components
- **Styling**: React Native StyleSheet

---

## 📂 Project Structure

```
tour-assist-ai/
├── App.js                          # Main entry point with navigation
├── screens/
│   ├── LoginScreen.js             # Login & authentication UI
│   ├── HomeScreen.js              # Home with feature cards
│   ├── ChatScreen.js              # Chat with AI assistant
│   └── MapScreen.js               # Map & location exploration
├── src/
│   ├── components/
│   │   ├── CustomButton.js        # Reusable button component
│   │   ├── CustomInput.js         # Reusable input field
│   │   ├── Header.js              # Header with back & theme toggle
│   │   ├── MessageCard.js         # Chat message bubble
│   │   ├── LocationCard.js        # Location card component
│   │   └── index.js               # Component exports
│   ├── context/
│   │   └── ThemeContext.js        # Dark mode context & provider
│   ├── constants/
│   │   └── theme.js               # Theme colors & spacing
│   └── styles/
│       └── (future global styles)
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
└── README.md                       # This file
```

---

## 🎯 Screens Overview

### 1. **Login Screen**
- Email & password input fields
- Form validation
- Error message display
- Sign-up link (UI only)
- Forgot password button (UI only)
- Beautiful red-themed design

### 2. **Home Screen**
- Welcome greeting
- Feature cards for:
  - 🎤 Start Translation
  - 🤖 Chat Assistant
  - 🗺️ Explore Places
- Statistics widget
- Dark mode toggle in header
- Logout button

### 3. **Chat Screen**
- Chat bubble UI (like WhatsApp)
- User messages (right side, red)
- Bot messages (left side, white)
- Message input with send button
- Auto-scroll to latest message
- Hardcoded AI responses for demo

### 4. **Map Screen**
- Interactive map centered on Tunisia
- 5 featured locations with markers
- Location cards in horizontal scroll
- Location details panel
- Tap locations to see details

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Expo Go app (for iPhone/Android testing)

### Installation

1. **Navigate to the project**:
   ```bash
   cd "c:\Users\HP\OneDrive\Bureau\TourAssist AI\tour-assist-ai"
   ```

2. **Install dependencies** (already done):
   ```bash
   npm install
   ```

### Running the App

#### Option 1: Start Expo (Recommended for iPhone)
```bash
npm start
```

Then:
- Press `i` for iOS
- Press `a` for Android
- Scan QR code with Expo Go app
- Press `w` for web browser

#### Option 2: Direct iOS (Mac only)
```bash
npm run ios
```

#### Option 3: Direct Android
```bash
npm run android
```

#### Option 4: Web Browser
```bash
npm run web
```

---

## 🎨 Theme System

### Colors
- **Primary Red**: `#E63946`
- **Secondary White**: `#F1FAEE`
- **Dark Mode**: Black + Red accents
- **Text**: Adaptive (Dark mode: white, Light mode: dark)

### Spacing Scale
- `xs`: 4px
- `sm`: 8px
- `md`: 12px
- `lg`: 16px
- `xl`: 24px
- `xxl`: 32px

### Border Radius
- `sm`: 4px
- `md`: 8px
- `lg`: 12px
- `xl`: 16px
- `xxl`: 24px

---

## 🌗 Dark Mode Usage

The dark mode is automatically available throughout the app via the `ThemeContext`:

```javascript
import { ThemeContext } from './src/context/ThemeContext';

function MyComponent() {
  const { theme, isDarkMode, toggleTheme } = useContext(ThemeContext);
  
  return (
    <View style={{ backgroundColor: theme.background }}>
      <Text style={{ color: theme.text }}>Hello!</Text>
    </View>
  );
}
```

---

## 📍 Featured Locations (Tunisia)

1. **Djerba Island** - White-washed buildings & beautiful beaches
2. **Sidi Bou Said** - Blue and white architecture
3. **Sahara Desert** - Golden dunes & camel trekking
4. **Carthage Ruins** - Ancient Roman ruins
5. **Medina of Tunis** - Traditional market & local culture

---

## 🔐 Demo Credentials

The login screen has form validation, but credentials are not checked. Use any valid email and password (6+ characters) to proceed.

**Demo Login**:
- Email: `demo@example.com`
- Password: `password123`

---

## 💬 Chat Assistant

The chat assistant uses hardcoded AI responses about Tunisia. When you send a message, it will:
1. Display your message on the right (red bubble)
2. Simulate a delay (800ms)
3. Display a random AI response on the left (white bubble)

---

## 🗺️ Map Features

- Interactive MapView centered on Tunisia
- Draggable map with zoom controls
- Red marker pins for locations
- Horizontal scroll through location cards
- Tab location to show details panel
- Location distance information

---

## 🎁 Bonus Features Implemented

✅ Smooth transitions between screens
✅ Clean button animations (activeOpacity)
✅ Nice spacing and typography
✅ Shadow effects for depth
✅ Responsive layout
✅ Scrollable content
✅ KeyboardAvoidingView for chat
✅ Error message handling
✅ Custom reusable components
✅ Professional color scheme

---

## 📦 Dependencies

```json
{
  "@react-navigation/native": "^7.2.2",
  "@react-navigation/stack": "^7.8.10",
  "react-native-screens": "~4.16.0",
  "react-native-safe-area-context": "~5.6.0",
  "react-native-maps": "^1.27.2",
  "expo-location": "^55.1.8",
  "react-native-gesture-handler": "~2.28.0",
  "expo": "~54.0.33"
}
```

---

## 🔧 Customization

### Change Theme Colors
Edit `src/constants/theme.js`:
```javascript
export const lightTheme = {
  primary: '#YOUR_COLOR',
  // ... other colors
};
```

### Add New Screens
1. Create a new screen in `/screens`
2. Add it to the Stack Navigator in `App.js`
3. Add navigation to it from other screens

### Modify Locations
Edit the `EXAMPLE_LOCATIONS` array in `screens/MapScreen.js`

### Change AI Responses
Edit the `AI_RESPONSES` array in `screens/ChatScreen.js`

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
npm start -- --port 8081
```

### Clear Cache
```bash
npm start -- --clear
```

### Reinstall Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Maps not showing
- Ensure you have the required permissions in `app.json`
- For iOS, the map should work in Expo Go
- For Android, you might need additional setup

### Slow Performance
- Try disabling dark mode for testing
- Ensure minimal other apps running
- Use a physical device instead of emulator

---

## 📱 Testing on iPhone (Expo Go)

1. Install **Expo Go** from App Store
2. Run `npm start` in terminal
3. See QR code in terminal/browser
4. Open Expo Go app
5. Scan QR code with device camera or in app
6. App will load and open

---

## 🎓 Project Highlights for Demo

- ✅ Modern and clean UI
- ✅ Professional color scheme (Red & White - Tunisia flag)
- ✅ Full dark mode support
- ✅ Complete navigation flow
- ✅ Reusable component architecture
- ✅ Form validation
- ✅ Chat simulation
- ✅ Map integration
- ✅ Responsive design
- ✅ Production-ready code structure

---

## 📄 License

This project is created as a final year project demo. Feel free to modify and extend it!

---

## 🤝 Support

For questions or issues, please review the code comments and structure. The app is built to be easily maintainable and extensible.

---

**Built with ❤️ for TourAssist AI**
