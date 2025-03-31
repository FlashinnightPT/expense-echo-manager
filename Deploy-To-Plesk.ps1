
# PowerShell script to build and package for Plesk deployment

param (
    [string]$OutputPath = ".\plesk-deployment"
)

# Create output directory if it doesn't exist
if (!(Test-Path $OutputPath)) {
    Write-Host "Creating output directory $OutputPath"
    New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
}

# Step 1: Build frontend
Write-Host "Building frontend..."
$frontendPath = "."
Set-Location $frontendPath
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend build failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
}

# Step 2: Copy frontend build to output directory
Write-Host "Copying frontend build to output directory..."
Copy-Item -Path ".\dist\*" -Destination $OutputPath -Recurse -Force

# Step 3: Build backend (.NET)
Write-Host "Building backend..."
$backendPath = ".\server"
Set-Location $backendPath
dotnet publish -c Release -o ..\temp-backend-publish
if ($LASTEXITCODE -ne 0) {
    Write-Host "Backend build failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
}

# Step 4: Copy backend build to output directory under 'api' folder
Write-Host "Copying backend build to output directory..."
$apiOutputPath = Join-Path -Path $OutputPath -ChildPath "api"
if (!(Test-Path $apiOutputPath)) {
    New-Item -ItemType Directory -Path $apiOutputPath -Force | Out-Null
}
Copy-Item -Path "..\temp-backend-publish\*" -Destination $apiOutputPath -Recurse -Force

# Step 5: Create web.config for the root to handle SPA routing
Write-Host "Creating web.config for frontend routing..."
@"
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="API Proxy" stopProcessing="true">
          <match url="^api/(.*)$" />
          <action type="Rewrite" url="api/{R:1}" />
        </rule>
        <rule name="SPA Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
            <add input="{REQUEST_URI}" pattern="^/api" negate="true" />
          </conditions>
          <action type="Rewrite" url="index.html" />
        </rule>
      </rules>
    </rewrite>
    <staticContent>
      <mimeMap fileExtension=".webp" mimeType="image/webp" />
      <mimeMap fileExtension=".woff" mimeType="application/font-woff" />
      <mimeMap fileExtension=".woff2" mimeType="application/font-woff2" />
    </staticContent>
  </system.webServer>
</configuration>
"@ | Out-File -FilePath (Join-Path -Path $OutputPath -ChildPath "web.config") -Encoding utf8

# Step 6: Clean up temporary files
Remove-Item -Path "..\temp-backend-publish" -Recurse -Force

Write-Host "Deployment package created at $OutputPath"
Write-Host "Upload the contents of this folder to your Plesk hosting root directory."
Write-Host "Ensure that the 'api' folder has execute permissions for ASP.NET applications."

# Return to original directory
Set-Location $PSScriptRoot
