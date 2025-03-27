
# PowerShell script to deploy the application to IIS

param (
    [string]$SiteName = "GFIN-API",
    [string]$AppPoolName = "GFIN-API-Pool",
    [string]$PhysicalPath = "C:\inetpub\wwwroot\GFIN-API",
    [string]$Port = "5000"
)

# Import the WebAdministration module
Import-Module WebAdministration

# Check if the application pool exists, and create it if it doesn't
if (!(Test-Path "IIS:\AppPools\$AppPoolName")) {
    Write-Host "Creating Application Pool $AppPoolName"
    New-WebAppPool -Name $AppPoolName
    Set-ItemProperty "IIS:\AppPools\$AppPoolName" -Name managedRuntimeVersion -Value "v4.0"
    Set-ItemProperty "IIS:\AppPools\$AppPoolName" -Name managedPipelineMode -Value "Integrated"
    Restart-WebAppPool -Name $AppPoolName
}

# Check if the site exists, and create it if it doesn't
if (!(Test-Path "IIS:\Sites\$SiteName")) {
    Write-Host "Creating Site $SiteName"
    New-WebSite -Name $SiteName -Port $Port -PhysicalPath $PhysicalPath -ApplicationPool $AppPoolName
} else {
    Write-Host "Site $SiteName already exists. Updating settings."
    Set-ItemProperty "IIS:\Sites\$SiteName" -Name physicalPath -Value $PhysicalPath
    Set-ItemProperty "IIS:\Sites\$SiteName" -Name applicationPool -Value $AppPoolName
}

# Ensure the site is running
Start-Website -Name $SiteName

Write-Host "Deployment complete. The API is available at http://localhost:$Port/api"
