@echo off
REM Quick Reference Commands for OpenPeerChat Development (Windows)
REM Usage: Run commands directly or source this file for functions

setlocal enabledelayedexpansion

if "%1"=="" goto show_help
if /i "%1"=="help" goto show_help
if /i "%1"=="install" goto install_deps
if /i "%1"=="clean-install" goto clean_install
if /i "%1"=="start" goto start_dev
if /i "%1"=="start-clean" goto start_dev_clean
if /i "%1"=="android" goto run_android
if /i "%1"=="ios" goto run_ios
if /i "%1"=="lint" goto lint
if /i "%1"=="lint-fix" goto lint_fix
if /i "%1"=="test" goto test
if /i "%1"=="rebuild-android" goto rebuild_android
if /i "%1"=="rebuild-ios" goto rebuild_ios
if /i "%1"=="rebuild-all" goto rebuild_all
if /i "%1"=="kill-metro" goto kill_metro
if /i "%1"=="check-versions" goto check_versions
if /i "%1"=="build-android-debug" goto build_android_debug
if /i "%1"=="outdated" goto check_outdated
if /i "%1"=="update" goto update_dependencies

goto show_help

:install_deps
echo Installing dependencies...
call npm install
echo [OK] Dependencies installed
goto end

:clean_install
echo Performing clean install...
if exist node_modules (
    echo Removing node_modules...
    rmdir /s /q node_modules
)
echo Clearing npm cache...
call npm cache clean --force
echo Installing dependencies...
call npm install
echo [OK] Clean install complete
goto end

:start_dev
echo Starting Metro bundler...
call npm start
goto end

:start_dev_clean
echo Starting Metro bundler (cache reset)...
call npm start -- --reset-cache
goto end

:run_android
echo Building and running Android app...
call npm run android
goto end

:run_ios
echo Building and running iOS app...
call npm run ios
goto end

:lint
echo Running ESLint...
call npm run lint
goto end

:lint_fix
echo Running ESLint with auto-fix...
call npx eslint . --fix
echo [OK] Linting complete
goto end

:test
echo Running tests...
call npm test
goto end

:rebuild_android
echo Cleaning Android build...
cd android
call gradlew clean
cd ..
echo [OK] Android cleaned
goto end

:rebuild_ios
echo [WARN] iOS rebuild requires macOS with CocoaPods installed.
echo [WARN] This command is not available on Windows.
echo [INFO] Please run 'pod deintegrate ^&^& pod install' on a macOS machine.
goto end

:rebuild_all
call :rebuild_android
call :rebuild_ios
echo [OK] All platforms rebuilt
goto end

:kill_metro
echo Killing process on port 8081...
call npx kill-port 8081
echo [OK] Port 8081 freed
goto end

:check_versions
echo Node version:
call node --version
echo npm version:
call npm --version
echo React Native CLI:
call npx react-native --version
goto end

:build_android_debug
echo Building Android debug APK...
cd android
call gradlew assembleDebug
cd ..
echo [OK] APK built: android\app\build\outputs\apk\debug\
goto end

:check_outdated
echo Checking for outdated packages...
call npm outdated
goto end

:update_dependencies
echo Updating dependencies...
call npm update
echo [OK] Dependencies updated
goto end

:show_help
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║    OpenPeerChat Development Commands (Windows)            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo SETUP ^& INSTALLATION
echo   dev-commands install          Install dependencies
echo   dev-commands clean-install    Clean install (remove node_modules^)
echo.
echo DEVELOPMENT
echo   dev-commands start            Start Metro bundler
echo   dev-commands start-clean      Start Metro with cache reset
echo   dev-commands android          Build and run Android app
echo   dev-commands ios              Build and run iOS app
echo.
echo CODE QUALITY
echo   dev-commands lint             Run ESLint
echo   dev-commands lint-fix         Run ESLint with auto-fix
echo   dev-commands test             Run Jest tests
echo.
echo NATIVE REBUILDS
echo   dev-commands rebuild-android  Clean Android build
echo   dev-commands rebuild-ios      Clean iOS build and pods
echo   dev-commands rebuild-all      Clean both platforms
echo.
echo TROUBLESHOOTING
echo   dev-commands kill-metro       Kill process on port 8081
echo   dev-commands check-versions   Show Node/npm/RN versions
echo.
echo BUILD ^& DEPLOY
echo   dev-commands build-android-debug    Build Android debug APK
echo.
echo MAINTENANCE
echo   dev-commands outdated         Check for outdated packages
echo   dev-commands update           Update all dependencies
echo.
echo ════════════════════════════════════════════════════════════
echo QUICK START
echo   1. dev-commands install
echo   2. dev-commands rebuild-all
echo   3. dev-commands start          (Terminal 1^)
echo   4. dev-commands android        (Terminal 2^)
echo ════════════════════════════════════════════════════════════
echo.
echo TROUBLESHOOTING QUICK FIXES
echo   • Metro won't start: dev-commands kill-metro ^&^& dev-commands start
echo   • Build fails: dev-commands clean-install ^&^& dev-commands rebuild-all
echo   • Port conflicts: dev-commands kill-metro
echo.
echo For more information, see:
echo   - MIGRATION_GUIDE.md
echo   - DEVELOPMENT.md
echo   - UPDATE_SUMMARY.md
echo.
goto end

:end
endlocal
