@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

if not exist ".env" (
    echo [HealthTrack] .env not found. Creating local .env configuration...
    set /p "DB_PASS=Enter your MySQL root password: "
    (
        echo DB_HOST=localhost
        echo DB_PORT=3306
        echo DB_NAME=healthtrack
        echo DB_USERNAME=root
        echo DB_PASSWORD=!DB_PASS!
        echo SERVER_PORT=8080
        echo CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
        echo HEALTHTRACK_SEED_ENABLED=true
        echo VITE_API_BASE_URL=http://localhost:8080/api
    ) > ".env"
    echo [HealthTrack] Created .env successfully.
)

set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
cd /d "%~dp0backend"
echo [HealthTrack] Starting Spring Boot backend on http://localhost:8080 ...
call "C:\Program Files\JetBrains\IntelliJ IDEA 2026.1.3\plugins\maven\lib\maven3\bin\mvn.cmd" spring-boot:run
if errorlevel 1 (
    echo.
    echo [HealthTrack] Backend failed to start. Check the error above or verify .env settings.
    pause
)
