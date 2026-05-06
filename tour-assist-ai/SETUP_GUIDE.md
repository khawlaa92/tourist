# 🧭 TourAssist AI - React Native Mobile App

A modern, feature-rich mobile application built with React Native (Expo) for exploring Tunisia with AI-powered assistance. The app features a beautiful red and white theme inspired by the Tunisia flag 🇹🇳, complete with dark mode support.

---

## 📱 Features

✨ **Beautiful Modern UI**
- Red and White theme (Tunisia flag colors)
- Dark Mode & Light Mode with smooth transitions
- Rounded corners and soft shadows
- Professional, production-ready design

🎯 **Core Screens**
1. **Login Screen** - Email/password authentication with validation
2. **Home Screen** - Welcome message with feature shortcuts
3. **Chat Screen** - AI chat interface with message bubbles
4. **Map Screen** - Interactive map with location markers

🌍 **Functionality**
- ✅ Translation voice assistant
- ✅ AI chat with hardcoded responses
- ✅ Interactive map with Tunisia locations
- ✅ Dark/Light mode toggle
- ✅ Smooth navigation with React Navigation
- ✅ Responsive design for all devices

---

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Stack Navigator)
- **Styling**: React Native StyleSheet
- **State Management**: React Context API
- **Maps**: react-native-maps
- **Icons**: Expo Vector Icons
- **Location**: expo-location

---

## 📋 Prerequisites

- Node.js (v16+)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Expo Go app installed on your iPhone or Android device

---

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
cd "tour-assist-ai"
npm install
```

### 2. Start the Development Server

```bash
npm start
```

The Expo Metro bundler will start, and you'll see a QR code in your terminal.

---

## 📱 Testing on Device

### **iPhone (iOS)**
1. Open the **Camera app** on your iPhone
2. Scan the **QR code** displayed in the terminal
3. Tap the notification that appears to open Expo Go

### **Android**
1. Open the **Expo Go** app
2. Tap "Scan QR Code"
3. Scan the **QR code** from the terminal

### **Web (Browser)**
```bash
# While the app is running, press 'w' in the terminal
```

---

## 📂 Project Structure

```
tour-assist-ai/
├── App.js                          # Main entry point with navigation setup
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
│
├── screens/                        # Screen components
│   ├── LoginScreen.js             # Login with email/password
│   ├── HomeScreen.js              # Home with feature cards
│   ├── ChatScreen.js              # Chat UI with AI responses
│   └── MapScreen.js               # Interactive map with markers
│
├── src/
│   ├── components/                # Reusable components
│   │   ├── CustomButton.js        # Styled button component
│   │   ├── CustomInput.js         # Text input with validation
│   │   ├── Header.js              # App header with theme toggle
│   │   ├── MessageCard.js         # Chat message bubble
│   │   └── LocationCard.js        # Location card for map
│   │
│   └── context/
│       └── ThemeContext.js        # Dark/Light mode context
│
├── constants/
│   └── theme.js                   # Theme colors, spacing, typography
│
├── assets/
│   └── images/                    # App icons and images
└── README.md                       # This file
```

---

## 🎨 Theme Configuration

### Colors
- **Primary**: `#c41e3a` (Tunisia Red)
- **Background Light**: `#FFFFFF`
- **Background Dark**: `#1a1a1a`
- **Text Light**: `#1a1a1a`
- **Text Dark**: `#FFFFFF`

### Spacing
- `xs`: 4px
- `sm`: 8px
- `md`: 12px
- `lg`: 16px
- `xl`: 20px
- `xxl`: 24px
- `xxxl`: 32px

### Typography
- `xs`: 12px
- `sm`: 14px
- `md`: 16px
- `lg`: 18px
- `xl`: 20px
- `xxl`: 24px
- `xxxl`: 32px

---

## 🌙 Dark Mode Implementation

The app uses React Context to manage theme state globally. Toggle dark mode using:
1. The switch in the Home screen header
2. Automatically synchronized across all screens
3. Fully supported on all components

---

## 💬 Sample Data

### Login Credentials (Demo Only)
- **Email**: any valid email format
- **Password**: minimum 6 characters

### Featured Locations (Map Screen)
1. **Djerba Island** - Beach paradise with Jewish heritage
2. **Sidi Bou Said** - Blue and white architecture
3. **Sahara Desert** - Golden dunes and camel trekking
4. **Carthage Ruins** - Ancient Roman heritage
5. **Medina of Tunis** - Traditional markets and culture

### AI Chat Responses
The chat screen includes 10+ hardcoded AI responses covering:
- Travel assistance
- Location recommendations
- Local cuisine suggestions
- Historical information

---

## 🔧 Available Commands

```bash
# Start development server
npm start

# Start on Android
npm run android

# Start on iOS
npm run ios

# Open in web browser
npm run web

# Run linter
npm run lint

# Reset project to clean state
npm run reset-project
```

---

## ✨ UI Features

### Login Screen
- Clean form layout with rounded inputs
- Real-time email validation
- Password strength indicator
- Error message display
- Sign-up and forgot-password links

### Home Screen
- Animated welcome message
- 3 feature cards (Translation, Chat, Explore)
- Statistics section
- Logout button

### Chat Screen
- WhatsApp-style message bubbles
- User messages (right, red background)
- Bot messages (left, white background)
- Auto-scroll to latest message
- Keyboard avoidance
- Input field with send button

### Map Screen
- Interactive map with scroll/zoom
- Custom markers for locations
- Horizontal scroll location cards
- Selected location details panel
- Distance and description for each place

---

## 🐛 Troubleshooting

### Port Already in Use
If port 8081 is occupied, Expo will automatically use port 8085 or ask for confirmation.

### Metro Bundler Issues
```bash
# Clear Metro cache
npm start -- --reset-cache

# Or clear all caches
rm -rf node_modules .expo
npm install
npm start
```

### Cannot Connect on Physical Device
- Ensure device is on the same WiFi network
- Firewall exceptions may be needed
- Try using Tunnel connection mode: `expo start --tunnel`

### Package Version Warnings
The app works with the installed packages. Warnings about expo-location and react-native-maps are compatibility notices but don't affect functionality.

---

## 📦 Deployment

### Build APK (Android)
```bash
expo build:android
```

### Build IPA (iOS)
```bash
expo build:ios
```

### Deploy to Expo Hosting
```bash
expo publish
```

---

## 🎓 Learning Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [React Navigation](https://reactnavigation.org)
- [React Context API](https://react.dev/reference/react/useContext)

---

## 📝 Notes

- This is a demo version with hardcoded responses
- Map requires actual API keys for production use
- Camera permissions may be needed for certain features
- App uses local state management (can be upgraded to Redux/Zustand)

---

## 🤝 Contributing

Feel free to modify and extend this project:
- Add real API integration
- Implement authentication backend
- Add more locations and features
- Improve animations and transitions

---

## 📄 License

This project is created for educational and demonstration purposes.

---

## 👨‍💻 Author

Built with ❤️ using React Native & Expo

**Happy Coding! 🚀**
