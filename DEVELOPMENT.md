# Development Best Practices & Setup Guide

## Project Overview

OpenPeerChat is a React Native peer-to-peer chat application with end-to-end encryption using RSA and nearby device discovery.

### Tech Stack
- **React**: 18.2.0
- **React Native**: 0.72.7
- **State Management**: React Hooks + AsyncStorage
- **Navigation**: React Navigation v6
- **Encryption**: RSA Native Module
- **Database**: SQLite
- **UI Components**: React Native Gifted Chat

## Development Setup

### Prerequisites
- Node.js 16+ (LTS recommended)
- npm or yarn
- Android SDK / Xcode (for native development)
- Watchman (for file watching)

### Installation Steps

1. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **For Android development**
   ```bash
   npm run android
   # or
   npx react-native run-android
   ```

3. **For iOS development**
   ```bash
   npm run ios
   # or
   npx react-native run-ios
   ```

4. **Start the Metro bundler**
   ```bash
   npm start
   # or
   npx react-native start
   ```

## Code Style Guidelines

### ESLint Rules
The project enforces ESLint with React Native community config. Run:
```bash
npm run lint
```

### Key Rules Enforced
- Use `const`/`let` instead of `var`
- Require semicolons
- Double quotes for strings
- Proper React Hook dependencies
- No unused variables (prefixed with `_` if intentional)

### Code Formatting Examples

#### ✅ Good: Proper async/await in useEffect
```javascript
useEffect(() => {
  const fetchData = async () => {
    const result = await AsyncStorage.getItem("key");
    setData(result);
  };
  fetchData();
}, []);
```

#### ❌ Bad: Async callback in useEffect
```javascript
useEffect(async () => {
  const result = await AsyncStorage.getItem("key");
  setData(result);
}, []);
```

#### ✅ Good: Proper cleanup
```javascript
useEffect(() => {
  const subscription = eventEmitter.addListener("event", handler);
  return () => subscription.remove();
}, []);
```

#### ❌ Bad: Missing cleanup
```javascript
useEffect(() => {
  eventEmitter.addListener("event", handler);
}, []);
```

#### ✅ Good: useCallback for callbacks
```javascript
const handlePress = useCallback(() => {
  navigation.navigate("Chat");
}, [navigation]);
```

#### ❌ Bad: Function redefined on every render
```javascript
const handlePress = () => {
  navigation.navigate("Chat");
};
```

## Component Structure

### Directory Organization
```
src/
├── screens/              # Screen components
│   ├── Home.js
│   ├── Chat.js
│   ├── Settings.js
│   └── ...
├── components/           # Reusable components
├── utils/                # Utility functions
├── services/             # Business logic
├── hooks/                # Custom React hooks
├── assets/               # Colors, Images, etc.
└── types/                # TypeScript type definitions (future)
```

### Component Template (JavaScript)
```javascript
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MyComponent = ({ navigation, route }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await AsyncStorage.getItem("data");
        setData(result);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    loadData();
  }, []);

  const handlePress = useCallback(() => {
    // Handle action
  }, [dependencies]);

  return (
    <View style={styles.container}>
      <Text>{data}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default MyComponent;
```

## Performance Optimization Tips

### 1. Memoization
```javascript
import { useMemo, useCallback } from "react";

// Memoize expensive computations
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

// Memoize callbacks
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

### 2. List Rendering
```javascript
// ✅ Good: Use FlatList for better performance
import { FlatList } from "react-native";

<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <ItemComponent item={item} />}
/>

// ❌ Avoid: map() in JSX with ScrollView
<ScrollView>
  {items.map((item) => <ItemComponent key={item.id} item={item} />)}
</ScrollView>
```

### 3. Navigation Optimization
```javascript
// Pass navigation dependency
useEffect(() => {
  const unsubscribe = navigation.addListener("focus", () => {
    // Load screen data
  });
  return unsubscribe;
}, [navigation]);  // ✅ Include navigation in dependencies
```

## Database Usage

### SQLite Best Practices
```javascript
import { getDBConnection, createTable, saveMessage } from "./dbUtils";

// Always use try-catch for DB operations
try {
  const db = await getDBConnection();
  await createTable(db);
  await saveMessage(db, senderId, receiverId, message, timestamp);
} catch (err) {
  console.error("DB Error:", err);
}
```

## Encryption/Decryption

### RSA Module Usage
```javascript
import { RSA } from "react-native-rsa-native";

// Encrypt
RSA.encrypt(plaintext, publicKey)
  .then((encrypted) => sendMessage(encrypted))
  .catch((err) => console.error("Encryption error:", err));

// Decrypt
RSA.decrypt(ciphertext, privateKey)
  .then((decrypted) => processMessage(decrypted))
  .catch((err) => console.error("Decryption error:", err));
```

## Event Handling

### DeviceEventEmitter Usage
```javascript
import { DeviceEventEmitter } from "react-native";

useEffect(() => {
  const subscription = DeviceEventEmitter.addListener(
    "eventName",
    (event) => {
      console.log("Event received:", event);
    }
  );

  return () => subscription.remove();  // Clean up!
}, []);
```

## Testing

### Run Tests
```bash
npm test
```

### Test File Location
```
__tests__/
├── App-test.js
└── [component-name].test.js
```

### Testing Example
```javascript
import React from "react";
import renderer from "react-test-renderer";
import App from "../App";

describe("<App />", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
```

## Debugging

### Console Logging Best Practices
```javascript
// ✅ Good: Use appropriate log levels
console.info("Application started");
console.warn("Deprecated API used");
console.error("Critical error:", error);

// ❌ Avoid: Too many console.log statements
console.log("Random debug");
```

### React DevTools
1. Install [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
2. Launch the app and open DevTools
3. Inspect component tree and state changes

### Network Inspection
- Use Flipper for Android debugging
- Check network requests and logs
- Monitor database queries

## Common Issues & Solutions

### Issue: Dependencies not installing
```bash
rm -rf node_modules
npm cache clean --force
npm install
```

### Issue: Metro bundler stuck
```bash
npm start -- --reset-cache
```

### Issue: Native module linking
```bash
# For Android
cd android && ./gradlew clean

# For iOS
cd ios && pod deintegrate && pod install
```

## Git Workflow

### Commit Message Format
```
type(scope): subject

body

footer
```

Examples:
```
feat(chat): add message encryption
fix(home): remove memory leak in useEffect
docs: update API documentation
style: fix code formatting
refactor(navigation): simplify navigator structure
```

### Branch Naming
- `feature/description`
- `fix/description`
- `docs/description`
- `refactor/description`

## Useful Commands

```bash
# Lint the code
npm run lint

# Run tests
npm test

# Start development
npm start

# Android development
npm run android

# iOS development
npm run ios

# Clean build
npm start -- --reset-cache

# Kill process on port 8081
npx kill-port 8081
```

## Resources

- [React Native Docs](https://reactnative.dev/)
- [React Navigation Docs](https://reactnavigation.org/)
- [React Hooks Guide](https://react.dev/reference/react)
- [React Native Components](https://reactnative.dev/docs/components-and-apis)

## Migration to TypeScript (Future)

The project has TypeScript configuration ready. To gradually migrate:

1. Create new components as `.tsx` files
2. Add type definitions incrementally
3. Use `tsconfig.json` as reference

Example TypeScript component:
```typescript
import React, { FC } from "react";
import { View, Text } from "react-native";

interface Props {
  title: string;
  onPress: () => void;
}

const MyComponent: FC<Props> = ({ title, onPress }) => {
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
};

export default MyComponent;
```

---

**Last Updated**: 2025-11-25
**Compatible With**: React 18.2.0+, React Native 0.72.7+
