# OpenPeerChat - Decentralized P2P Messaging

![React Native](https://img.shields.io/badge/React%20Native-0.72.7-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![License](https://img.shields.io/badge/License-GPL%202.0-green)

> A peer-to-peer messaging application with end-to-end encryption and nearby device discovery

## 🎯 About

OpenPeerChat is a React Native application that enables peer-to-peer communication without relying on central servers. The app provides:

- **Privacy**: End-to-end RSA encryption
- **Decentralization**: Direct peer-to-peer messaging
- **Resilience**: Works in remote areas and network outages
- **Efficiency**: Nearby device discovery using Google Nearby Connection API
- **Security**: Message encryption and secure key exchange

### Key Features
- 🔐 RSA end-to-end encryption
- 📱 Nearby device discovery and connection
- 💬 Real-time messaging with GiftedChat UI
- 🗄️ Local SQLite database
- ⚡ Performance optimized with React Hooks
- 📡 Google Nearby Connection API integration

## 📋 Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | React Native | 0.72.7 |
| UI Library | React | 18.2.0 |
| Navigation | React Navigation | 6.1.17 |
| Messaging UI | React Native Gifted Chat | 2.4.0 |
| Encryption | RSA Native Module | 2.0.3 |
| Database | SQLite | 6.0.0 |
| Icons | React Native Vector Icons | 10.0.0 |
| State Management | React Hooks + AsyncStorage | 1.23.1 |
| Animation | Reanimated | 3.5.4 |
| Build Tool | Metro | 0.76.8 |
| Linting | ESLint | 8.55.0 |
| Testing | Jest | 29.7.0 |

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ (LTS recommended)
- npm or yarn
- Android SDK (for Android development)
- Xcode (for iOS development)
- Watchman (recommended for file watching)

### Installation

#### 1. Clone and Install
```bash
git clone https://github.com/AOSSIE-Org/OpenPeerChat-react-native.git
cd OpenPeerChat-react-native
npm install
```

#### 2. Development Commands (Windows)
```bash
# View all available commands
dev-commands help

# Quick start sequence
dev-commands install
dev-commands rebuild-all
dev-commands start           # Terminal 1
dev-commands android         # Terminal 2
```

#### 3. Development Commands (macOS/Linux)
```bash
# Source the commands
source dev-commands.sh

# Quick start sequence
install-deps
rebuild-all
start-dev &              # Terminal 1
run-android              # Terminal 2
```

#### 4. Manual Setup
```bash
# Install dependencies
npm install

# Start Metro bundler
npm start

# In a new terminal - Run Android
npm run android

# Or run iOS
npm run ios
```

## 📁 Project Structure

```
OpenPeerChat-react-native/
├── src/                          # Source components
│   ├── Home.js                  # Contact list screen
│   ├── Chat.js                  # Messaging interface
│   ├── Settings.js              # Settings screen
│   ├── Name.js                  # Name setup screen
│   ├── AddChat.js               # Add contact screen
│   ├── Splash.js                # Splash screen
│   ├── Message.js               # Message utilities
│   ├── dbUtils.js               # SQLite database utilities
│   ├── Utils.js                 # General utilities
│   └── assets/                  # Colors, images, fonts
├── android/                     # Android native code
├── ios/                         # iOS native code
├── __tests__/                   # Test files
├── App.js                       # Root component
├── index.js                     # Entry point
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config (optional)
├── .eslintrc.json               # ESLint configuration
└── Documentation
    ├── MIGRATION_GUIDE.md       # Dependency upgrade guide
    ├── DEVELOPMENT.md           # Development best practices
    ├── UPDATE_SUMMARY.md        # Recent updates summary
    └── dev-commands.bat/sh      # Development command scripts
```

## 📖 Documentation

### For New Developers
Start with these guides:
1. **[DEVELOPMENT.md](DEVELOPMENT.md)** - Development setup and best practices
2. **[dev-commands.bat](dev-commands.bat)** or **[dev-commands.sh](dev-commands.sh)** - Command reference

### For Upgrading Dependencies
1. **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - Detailed migration information
2. **[UPDATE_SUMMARY.md](UPDATE_SUMMARY.md)** - Summary of recent changes

### For Understanding Nearby Connections API
See [Native Modules](#-native-modules) section below

## 🔧 Available Commands

### Setup & Installation
```bash
npm install              # Install dependencies
npm cache clean --force  # Clear npm cache
```

### Development
```bash
npm start                # Start Metro bundler
npm run android          # Build and run Android
npm run ios              # Build and run iOS
```

### Code Quality
```bash
npm run lint             # Run ESLint
npx eslint . --fix       # Auto-fix linting issues
npm test                 # Run Jest tests
```

### Maintenance
```bash
npm outdated             # Check for outdated packages
npm update               # Update dependencies
```

### Using Command Scripts (Recommended)

**Windows:**
```batch
dev-commands install     # Install dependencies
dev-commands start       # Start development
dev-commands android     # Build Android
dev-commands rebuild-all # Clean rebuild all platforms
```

**macOS/Linux:**
```bash
source dev-commands.sh
install-deps             # Install dependencies
start-dev                # Start development
run-android              # Build Android
rebuild-all              # Clean rebuild all platforms
```

## 📱 Native Modules

### Google Nearby Connection API

A custom React Native module exposes the following methods:

#### `startDiscovery(id: string, callback: (error, endpoints) => void)`
Starts discovering nearby devices
```javascript
NearbyConnection.startDiscovery("device-id");
```

#### `startAdvertising(id: string, callback: (error) => void)`
Starts advertising to nearby devices
```javascript
NearbyConnection.startAdvertising("device-id");
```

#### `sendMessage(endpointId: string, payload: string, callback: (error) => void)`
Sends message to a nearby device
```javascript
NearbyConnection.sendMessage("endpoint-id", "message-payload");
```

#### Event Listeners
```javascript
import { DeviceEventEmitter } from "react-native";

// Listen for discovered endpoints
DeviceEventEmitter.addListener("endpoints", (endpoints) => {
  console.log("Available endpoints:", endpoints);
});

// Listen for incoming messages
DeviceEventEmitter.addListener("message", (event) => {
  console.log("Message received:", event.message);
});
```

## 🔐 Encryption

The app uses RSA encryption for end-to-end security:

```javascript
import { RSA } from "react-native-rsa-native";

// Encrypt message
RSA.encrypt(plaintext, publicKey)
  .then((encrypted) => sendMessage(encrypted))
  .catch((error) => console.error(error));

// Decrypt message
RSA.decrypt(ciphertext, privateKey)
  .then((decrypted) => processMessage(decrypted))
  .catch((error) => console.error(error));
```

## 💾 Database

Uses SQLite for local message storage:

```javascript
import { getDBConnection, saveMessage, getMyChatMessages } from "./src/dbUtils";

const db = await getDBConnection();
await saveMessage(db, senderId, receiverId, messageText, timestamp);
const messages = await getMyChatMessages(db, senderId, receiverId);
```

## ⚙️ Configuration Files

### `tsconfig.json`
TypeScript configuration for gradual TypeScript adoption. Currently allows `.js` files with optional type annotations.

### `.eslintrc.json`
ESLint configuration enforcing:
- React Hook rules
- Modern JavaScript patterns (const/let, arrow functions)
- Proper dependency arrays
- No unused variables

### `metro.config.js`
Metro bundler configuration for optimized React Native builds

### `.gitignore`
Excludes build artifacts, caches, and IDE files from version control

## 📊 Recent Updates (v2025-11-25)

### Dependency Upgrades
- React: 17.0.1 → 18.2.0
- React Native: 0.64.2 → 0.72.7
- React Navigation: 5.x → 6.x
- Jest: 27.x → 29.x
- ESLint: 7.x → 8.x

### Code Improvements
- Fixed async/await anti-patterns in useEffect
- Proper event listener cleanup
- Performance optimization in component rendering
- Better hook dependencies
- Added error handling

For detailed changes, see [UPDATE_SUMMARY.md](UPDATE_SUMMARY.md) and [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md).

## 🧪 Testing

Run tests with:
```bash
npm test
```

Tests are located in `__tests__/` directory.

## 🐛 Troubleshooting

### Build Issues
```bash
# Clear everything and reinstall
rm -rf node_modules
npm cache clean --force
npm install

# Rebuild native code
npm run android  # or npm run ios
```

### Metro Bundler Won't Start
```bash
npx kill-port 8081
npm start -- --reset-cache
```

### Native Module Linking Issues
```bash
# Android
cd android && ./gradlew clean

# iOS
cd ios && pod deintegrate && pod install
```

See [DEVELOPMENT.md](DEVELOPMENT.md) for more troubleshooting tips.

## 📚 Learning Resources

- [React Native Documentation](https://reactnative.dev/)
- [React Hooks Guide](https://react.dev/reference/react)
- [React Navigation v6](https://reactnavigation.org/)
- [Google Nearby Connections](https://developers.google.com/nearby/connections)
- [RSA Encryption](https://en.wikipedia.org/wiki/RSA_(cryptosystem))

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the code style (ESLint enforced)
4. Commit with clear messages (see [DEVELOPMENT.md](DEVELOPMENT.md#git-workflow))
5. Push to your fork
6. Open a Pull Request

### Code Style
- Use `const`/`let` instead of `var`
- Arrow functions for callbacks
- Proper React Hook patterns
- Include error handling
- Add comments for complex logic

## 📄 License

This project is licensed under the GNU General Public License v2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [AOSSIE Community](https://aossie.org/) - Organization
- [Google Nearby Connections API](https://developers.google.com/nearby/connections)
- React Native community
- Contributors and maintainers

## 📞 Contact & Support

- **Project Repository**: [GitHub](https://github.com/AOSSIE-Org/OpenPeerChat-react-native)
- **Issue Tracker**: [GitHub Issues](https://github.com/AOSSIE-Org/OpenPeerChat-react-native/issues)
- **Documentation**: See [DEVELOPMENT.md](DEVELOPMENT.md) and [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)

---

**Last Updated**: November 25, 2025  
**Status**: ✅ Actively Maintained  
**Compatibility**: React Native 0.72.7+, React 18.2.0+`receiveMessage` - Receives message from nearby devices

`getEndpoints` - Get Nearby devices available

# Screenshots

- [Splash](https://ibb.co/xshDM28)
- [Info](https://ibb.co/9ThsNfD)
- [Chat](https://ibb.co/wYHMsPy)
- [Add Chat](https://ibb.co/1MYG6QQ)
- [Home](https://ibb.co/jb3Kcbk)
