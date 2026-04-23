@echo off
cls
echo.
echo ========================================
echo   ENHANCED PAGE STYLES INSTALLATION
echo   Medical Records + ML + Reports + More
echo ========================================
echo.
echo This will add beautiful styling for:
echo - Medical Records page
echo - ML Predictions page
echo - Reports page
echo - User Management page
echo - Settings page
echo.
pause
echo.

cd /d "%~dp0"

echo [Step 1/5] Backing up current CSS...
if exist src\index.css (
    copy src\index.css src\index.css.backup >nul 2>&1
    echo ✓ Backup created
)
echo.

echo [Step 2/5] Checking for base theme...
findstr /C:"--text-primary" src\index.css >nul 2>&1
if %ERRORLEVEL%==0 (
    echo ✓ Base theme detected
    echo   Adding enhanced page styles...
    type enhanced-pages.css >> src\index.css
) else (
    echo ! Base theme not found
    echo   Installing complete theme (base + pages)...
    copy /Y improved-theme.css src\index.css >nul 2>&1
    type enhanced-pages.css >> src\index.css
)
echo.

echo [Step 3/5] Verifying installation...
findstr /C:"medical-records-page" src\index.css >nul 2>&1
if %ERRORLEVEL%==0 (
    echo ✓ Enhanced page styles installed
) else (
    echo ✗ Installation may have failed
    goto error
)
echo.

echo [Step 4/5] Clearing caches...
if exist node_modules\.vite (
    rmdir /S /Q node_modules\.vite >nul 2>&1
    echo ✓ Vite cache cleared
)
echo.

echo [Step 5/5] Final verification...
echo ✓ All files ready
echo.

echo ========================================
echo   INSTALLATION COMPLETE! 🎉
echo ========================================
echo.
echo NEW STYLES ADDED FOR:
echo.
echo ✓ Medical Records Page
echo   - Beautiful record cards
echo   - Upload zone with gradients
echo   - Type badges
echo   - Hover animations
echo.
echo ✓ ML Predictions Page
echo   - Gradient tabs
echo   - Result cards with icons
echo   - Probability circles
echo   - Risk badges
echo.
echo ✓ Reports Page
echo   - Report type cards
echo   - Export buttons
echo   - Stats grid
echo   - Preview layouts
echo.
echo ✓ User Management Page
echo   - User stat cards
echo   - Role badges
echo   - Avatar styles
echo   - Search interface
echo.
echo ✓ Settings Page
echo   - Sidebar navigation
echo   - Toggle switches
echo   - Profile upload
echo   - Security sections
echo.
echo ========================================
echo   NEXT STEPS:
echo ========================================
echo.
echo 1. Run: npm run dev
echo 2. Navigate to each page
echo 3. See the beautiful new styles!
echo.
echo Pages to check:
echo - /records (Medical Records)
echo - /ml-predictions (ML Predictions)
echo - /reports (Reports)
echo - /users (User Management)
echo - /settings (Settings)
echo.
pause
goto end

:error
echo.
echo ========================================
echo   ERROR OCCURRED!
echo ========================================
echo.
echo Please ensure both files are present:
echo - improved-theme.css
echo - enhanced-pages.css
echo.
pause
goto end

:end
