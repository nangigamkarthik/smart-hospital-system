@echo off
echo ========================================
echo  INSTALLING BEAUTIFUL CSS THEME
echo  Teal-Cyan-Purple Color Palette
echo ========================================
echo.

cd /d "%~dp0"

echo [Step 1] Backing up current CSS (if exists)...
if exist src\index.css (
    copy src\index.css src\index.css.backup
    echo ✓ Backup created: src\index.css.backup
) else (
    echo ✓ No existing CSS to backup
)
echo.

echo [Step 2] Installing new stunning CSS...
copy /Y complete-styles.css src\index.css
echo ✓ New CSS installed
echo.

echo [Step 3] Updating index.html...
copy /Y index.html index.html
echo ✓ index.html updated
echo.

echo [Step 4] Clearing Vite cache...
if exist node_modules\.vite (
    rmdir /S /Q node_modules\.vite
    echo ✓ Cache cleared
) else (
    echo ✓ No cache to clear
)
echo.

echo ========================================
echo  INSTALLATION COMPLETE!
echo ========================================
echo.
echo Your app now has a STUNNING design with:
echo ✓ Teal-Cyan-Purple gradient theme
echo ✓ Modern glassmorphism effects
echo ✓ Smooth animations
echo ✓ Beautiful shadows
echo ✓ Responsive design
echo.
echo Now run: npm run dev
echo.
echo The UI will look AMAZING! 🎨✨
echo.
pause
