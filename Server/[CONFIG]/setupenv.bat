@echo off

:: BatchGotAdmin
:-------------------------------------
REM  --> Check for permissions
    IF "%PROCESSOR_ARCHITECTURE%" EQU "amd64" (
>nul 2>&1 "%SYSTEMROOT%\SysWOW64\cacls.exe" "%SYSTEMROOT%\SysWOW64\config\system"
) ELSE (
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
)

REM --> If error flag set, we do not have admin.
if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    set params= %*
    echo UAC.ShellExecute "cmd.exe", "/c ""%~s0"" %params:"=""%", "", "runas", 1 >> "%temp%\getadmin.vbs"

    "%temp%\getadmin.vbs"
    del "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    pushd "%CD%"
    CD /D "%~dp0"
:-------------------------------------- 

REM Download and install MinIO server
echo Downloading MinIO server...
curl -L -o minio.exe https://dl.min.io/server/minio/release/windows-amd64/minio.exe
echo MinIO server installation completed.

echo.

REM Download and install MinIO client (mc)
echo Downloading MinIO client (mc)...
curl -L https://dl.min.io/client/mc/release/windows-amd64/mc.exe -o mc.exe
echo MinIO client (mc) installation completed.

echo.

REM Download and install Elasticsearch
echo Downloading Elasticsearch...
curl -L -o elasticsearch.zip https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-8.6.2-windows-x86_64.zip
tar -xf elasticsearch.zip
echo Elasticsearch installation completed.

echo.

REM Download and install openssl
echo Downloading and installing openssl...
curl -L -o openssl-1.0.2j-fips-x86_64.zip https://netix.dl.sourceforge.net/project/openssl/openssl-1.0.2j-fips-x86_64/openssl-1.0.2j-fips-x86_64.zip
tar -xf openssl-1.0.2j-fips-x86_64.zip
setx /M PATH "%PATH%;%~dp0OpenSSL\bin"
echo openssl installed

echo.

REM Start MinIO server on port 9090
echo Starting MinIO server on port 9090...
start "MinIO" cmd /c %~dp0minio.exe server %~dp0 --console-address :9090
echo MinIO server started.
echo.
echo --------------------------------------------------------------------
echo "CONTINUE WHEN YOU MAKE SURE MinIO IS UP AND RUNNING"
echo "make sure by going to http://localhost:9090"
echo --------------------------------------------------------------------
echo.
timeout /t 100 2> NUL

echo.

REM Configure mc to use MinIO server
%~dp0mc.exe alias set myminio/ http://localhost:9000/ minioadmin minioadmin

REM Create a new user account and a bucket on MinIO
echo Creating new user account and bucket on MinIO...
%~dp0mc admin user add myminio/ dms-backend backend-passwd
%~dp0mc mb --ignore-existing myminio/dev
%~dp0mc admin policy attach myminio/ readwrite --user dms-backend
taskkill /FI "WindowTitle eq MinIO*" /T /F > NUL
echo New user account and bucket created on MinIO.

echo.

REM Start elasticsearch
start "Elasticsearch" cmd /c %~dp0elasticsearch-8.6.2\bin\elasticsearch
echo Elasticsearch started.
echo.
echo --------------------------------------------------------------------
echo "DON'T CONTINUE UNTIL ElasticSearch IS UP AND RUNNING"
echo "go to https://localhost:9200 to make sure it's running"
echo --------------------------------------------------------------------
echo.
timeout /t 300 2> NUL

echo.

REM Retrieve Elasticsearch password for elastic user
echo Retrieving Elasticsearch password for elastic user...
FOR /F %%i IN ('%~dp0elasticsearch-8.6.2\bin\elasticsearch-reset-password -s -b -u elastic') DO set password=%%i
echo Elasticsearch password for elastic user is %password%

echo.

REM Get Elasticsearch certificate fingerprint
echo Retrieving Elasticsearch certificate fingerprint...
set fingerprint=
for /f "tokens=2 delims==" %%a in ('openssl x509 -fingerprint -sha256 -in %~dp0elasticsearch-8.6.2\config\certs\http_ca.crt') do set fingerprint=%%a
taskkill /FI "WindowTitle eq Elasticsearch*" /T /F > NUL
echo Elasticsearch certificate fingerprint is %fingerprint%

echo.

REM Setting env variables
echo Setting env variables
setx /M PATH "%PATH%;%~dp0elasticsearch-8.6.2\bin\"
setx /M PATH "%PATH%;%~dp0bin"

echo.

REM Create startenv
echo Creating startenv...
if not exist "%~dp0bin" mkdir %~dp0bin
echo start /b cmd /c "%~dp0minio.exe server %~dp0storage --console-address :9090" > %~dp0bin\startminio.bat
echo @echo off > %~dp0bin\startenv.bat
echo start /b cmd /c startminio >> %~dp0bin\startenv.bat
echo elasticsearch >> %~dp0bin\startenv.bat
echo Created startenv

echo.

REM Write credentials to JSON file
echo Writing credentials to JSON file...
(
    echo {
    echo   "MinIO": {
    echo     "Endpoint": "http://localhost:9000",
    echo     "AccessKey": "dms-backend",
    echo     "SecretKey": "backend-passwd",
    echo     "BucketName": "dev"
    echo   },
    echo   "ElasticSearch": {
    echo     "Uri": "http://localhost:9200",
    echo     "Username": "elastic",
    echo     "Password": "%password%",
    echo     "Fingerprint": "%fingerprint%",
    echo     "Index": "nova_node_metadata"
    echo   }
    echo }
) > credentials.json
echo Credentials written to credentials.json.
echo Finished. you can startenv
pause
