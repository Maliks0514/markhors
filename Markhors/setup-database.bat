@echo off
echo ========================================
echo Chitral Markhors - Database Setup
echo ========================================
echo.

REM Create .env file for backend
if not exist server\.env (
    echo Creating server\.env file...
    (
        echo MONGODB_URI=mongodb://localhost:27017/markhors
        echo PORT=5000
        echo NODE_ENV=development
    ) > server\.env
    echo ✓ Created server\.env
) else (
    echo ✓ server\.env already exists
)

REM Create .env.local for frontend
if not exist .env.local (
    echo Creating .env.local file...
    (
        echo REACT_APP_API_URL=http://localhost:5000/api
    ) > .env.local
    echo ✓ Created .env.local
) else (
    echo ✓ .env.local already exists
)

REM Install backend dependencies
echo.
echo Installing backend dependencies...
cd server
call npm install
cd ..

echo.
echo ========================================
echo Setup Complete! 
echo ========================================
echo.
echo Next steps:
echo 1. Start MongoDB:
echo    mongod
echo.
echo 2. Start Backend (in new terminal):
echo    cd server
echo    npm start
echo.
echo 3. Start Frontend (in another terminal):
echo    npm run dev
echo.
echo For more details, see DATABASE_SETUP.md
echo.
pause
