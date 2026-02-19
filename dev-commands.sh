#!/bin/bash
# Quick Reference Commands for OpenPeerChat Development

# ============================================
# SETUP & INSTALLATION
# ============================================

# Install dependencies
install-deps() {
  echo "Installing dependencies..."
  npm install
  echo "✅ Dependencies installed"
}

# Clean install (nuclear option)
clean-install() {
  echo "Performing clean install..."
  rm -rf node_modules
  npm cache clean --force
  npm install
  echo "✅ Clean install complete"
}

# ============================================
# DEVELOPMENT
# ============================================

# Start Metro bundler
start-dev() {
  echo "Starting Metro bundler..."
  npm start
}

# Start with cache reset
start-dev-clean() {
  echo "Starting Metro bundler (cache reset)..."
  npm start -- --reset-cache
}

# Android development
run-android() {
  echo "Building and running Android app..."
  npm run android
}

# iOS development
run-ios() {
  echo "Building and running iOS app..."
  npm run ios
}

# ============================================
# CODE QUALITY
# ============================================

# Run linter
lint() {
  echo "Running ESLint..."
  npm run lint
}

# Run tests
test() {
  echo "Running tests..."
  npm test
}

# Run linter with --fix
lint-fix() {
  echo "Running ESLint with auto-fix..."
  npx eslint . --fix
}

# ============================================
# NATIVE REBUILDS
# ============================================

# Clean Android build
rebuild-android() {
  echo "Cleaning Android build..."
  cd android || return 1
  ./gradlew clean
  echo "✅ Android cleaned"
  cd .. || return 1
}

# Clean iOS build
rebuild-ios() {
  echo "Cleaning iOS build..."
  cd ios
  rm -rf Pods
  pod deintegrate
  pod install
  echo "✅ iOS cleaned and pods reinstalled"
  cd ..
}

# Rebuild both platforms
rebuild-all() {
  rebuild-android
  rebuild-ios
  echo "✅ All platforms rebuilt"
}

# ============================================
# TROUBLESHOOTING
# ============================================

# Kill process on default Metro port
kill-metro() {
  echo "Killing process on port 8081..."
  npx kill-port 8081
  echo "✅ Port 8081 freed"
}

# Reset Metro cache
reset-cache() {
  echo "Resetting Metro cache..."
  rm -rf ~/.metro-cache
  npm start -- --reset-cache
}

# Check Node and npm versions
check-versions() {
  echo "Node version:"
  node --version
  echo "npm version:"
  npm --version
  echo "React Native CLI:"
  npx react-native --version
}

# ============================================
# BUILD & DEPLOY
# ============================================

# Build Android APK (debug)
build-android-debug() {
  echo "Building Android debug APK..."
  cd android || return 1
  ./gradlew assembleDebug
  echo "✅ APK built: android/app/build/outputs/apk/debug/"
  cd .. || return 1
}

# Build Android APK (release)
build-android-release() {
  echo "Building Android release APK..."
  cd android || return 1
  ./gradlew assembleRelease
  echo "✅ APK built: android/app/build/outputs/apk/release/"
  cd .. || return 1
}

# ============================================
# DEBUGGING
# ============================================

# View console logs (Android)
logcat-android() {
  echo "Viewing Android console logs..."
  adb logcat *:S ReactNative:V ReactNativeJS:V
}

# Clear app data (Android)
clear-android-data() {
  echo "Clearing Android app data..."
  adb shell pm clear com.aossiep2p
  echo "✅ App data cleared"
}

# Clear app data (iOS)
clear-ios-data() {
  echo "Clearing iOS app data..."
  xcrun simctl erase all
  echo "⚠️  All simulators erased"
}

# ============================================
# MAINTENANCE
# ============================================

# Check for outdated packages
check-outdated() {
  echo "Checking for outdated packages..."
  npm outdated
}

# Update to latest minor/patch versions
update-dependencies() {
  echo "Updating dependencies..."
  npm update
  echo "✅ Dependencies updated"
}

# Upgrade specific package
upgrade-package() {
  if [ -z "$1" ]; then
    echo "Usage: upgrade-package <package-name>"
    return 1
  fi
  echo "Upgrading $1..."
  npm install $1@latest
  echo "✅ $1 upgraded"
}

# ============================================
# UTILITY
# ============================================

# View project structure
tree-view() {
  echo "Project structure:"
  ls -la src/
}

# Generate Metro config report
metro-report() {
  echo "Generating Metro config report..."
  node -e "const config = require('./metro.config.js'); console.log(JSON.stringify(config, null, 2))"
}

# ============================================
# DISPLAY HELP
# ============================================

show-help() {
  cat << EOF
╔════════════════════════════════════════════════════════════╗
║    OpenPeerChat Development Commands Reference            ║
╚════════════════════════════════════════════════════════════╝

SETUP & INSTALLATION
  install-deps          Install dependencies
  clean-install         Clean install (remove node_modules)

DEVELOPMENT
  start-dev            Start Metro bundler
  start-dev-clean      Start Metro with cache reset
  run-android          Build and run Android app
  run-ios              Build and run iOS app

CODE QUALITY
  lint                 Run ESLint
  lint-fix             Run ESLint with auto-fix
  test                 Run Jest tests

NATIVE REBUILDS
  rebuild-android      Clean Android build
  rebuild-ios          Clean iOS build and pods
  rebuild-all          Clean both platforms

TROUBLESHOOTING
  kill-metro           Kill process on port 8081
  reset-cache          Reset Metro cache
  check-versions       Show Node/npm/RN versions

BUILD & DEPLOY
  build-android-debug   Build Android debug APK
  build-android-release Build Android release APK

DEBUGGING
  logcat-android       View Android console logs
  clear-android-data   Clear Android app data
  clear-ios-data       Clear iOS simulator data

MAINTENANCE
  check-outdated       Check for outdated packages
  update-dependencies  Update all dependencies
  upgrade-package      Upgrade specific package

UTILITY
  tree-view           View project structure
  metro-report        Show Metro config
  show-help           Display this help message

QUICK START
  1. install-deps              # Install dependencies
  2. rebuild-all               # Clean rebuild
  3. start-dev                 # Terminal 1: Start Metro
  4. run-android OR run-ios    # Terminal 2: Run app

TROUBLESHOOTING QUICK FIXES
  • Metro won't start: kill-metro && start-dev
  • Build fails: clean-install && rebuild-all
  • Port conflicts: kill-metro
  • Cache issues: start-dev-clean

EOF
}

# Alias for help
help() {
  show-help
}

# Default action
if [ $# -eq 0 ]; then
  show-help
fi
