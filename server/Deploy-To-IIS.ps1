
# PowerShell script to deploy the application to IIS

param (
    [string]$SiteName = "GFIN-API",
    [string]$AppPoolName = "GFIN-API-Pool",
    [string]$PhysicalPath = "C:\inetpub\wwwroot\GFIN-API",
    [string]$Port = "80",
    [switch]$EnableDetailedErrors = $true
)

# Import the WebAdministration module
Import-Module WebAdministration

# Check if the application pool exists, and create it if it doesn't
if (!(Test-Path "IIS:\AppPools\$AppPoolName")) {
    Write-Host "Creating Application Pool $AppPoolName"
    New-WebAppPool -Name $AppPoolName
    Set-ItemProperty "IIS:\AppPools\$AppPoolName" -Name managedRuntimeVersion -Value "v4.0"
    Set-ItemProperty "IIS:\AppPools\$AppPoolName" -Name managedPipelineMode -Value "Integrated"
    
    # Set identity to ApplicationPoolIdentity
    Set-ItemProperty "IIS:\AppPools\$AppPoolName" -Name processModel.identityType -Value "ApplicationPoolIdentity"
    
    Restart-WebAppPool -Name $AppPoolName
}

# Create the physical path if it doesn't exist
if (!(Test-Path $PhysicalPath)) {
    Write-Host "Creating directory $PhysicalPath"
    New-Item -ItemType Directory -Path $PhysicalPath -Force
}

# Set permissions for the app pool on the physical path
$Acl = Get-Acl $PhysicalPath
$AppPoolSid = (New-Object Security.Principal.NTAccount "IIS AppPool\$AppPoolName").Translate([Security.Principal.SecurityIdentifier])
$AccessRule = New-Object System.Security.AccessControl.FileSystemAccessRule($AppPoolSid, "FullControl", "ContainerInherit,ObjectInherit", "None", "Allow")
$Acl.SetAccessRule($AccessRule)
Set-Acl $PhysicalPath $Acl
Write-Host "Set permissions for IIS AppPool\$AppPoolName on $PhysicalPath"

# Check if the site exists, and create it if it doesn't
if (!(Test-Path "IIS:\Sites\$SiteName")) {
    Write-Host "Creating Site $SiteName"
    New-WebSite -Name $SiteName -Port $Port -PhysicalPath $PhysicalPath -ApplicationPool $AppPoolName -Force
} else {
    Write-Host "Site $SiteName already exists. Updating settings."
    Set-ItemProperty "IIS:\Sites\$SiteName" -Name physicalPath -Value $PhysicalPath
    Set-ItemProperty "IIS:\Sites\$SiteName" -Name applicationPool -Value $AppPoolName
}

# Enable detailed errors if requested
if ($EnableDetailedErrors) {
    Write-Host "Enabling detailed errors"
    Set-WebConfigurationProperty -filter /system.webServer/httpErrors -name errorMode -value "Detailed" -PSPath "IIS:\Sites\$SiteName"
}

# Enable the required IIS features
Write-Host "Ensuring required IIS features are enabled"
$features = @(
    "Web-Server",
    "Web-Common-Http",
    "Web-Http-Errors",
    "Web-Static-Content",
    "Web-Default-Doc",
    "Web-Dir-Browsing",
    "Web-Http-Redirect",
    "Web-Http-Logging",
    "Web-Request-Monitor",
    "Web-Stat-Compression",
    "Web-Dyn-Compression",
    "Web-Filtering",
    "Web-Net-Ext",
    "Web-Net-Ext45",
    "Web-Asp-Net",
    "Web-Asp-Net45",
    "Web-ISAPI-Ext",
    "Web-ISAPI-Filter",
    "Web-Mgmt-Console"
)

foreach ($feature in $features) {
    $installed = Get-WindowsFeature -Name $feature -ErrorAction SilentlyContinue
    if ($installed -and $installed.InstallState -ne "Installed") {
        try {
            Write-Host "Installing IIS feature: $feature"
            Install-WindowsFeature -Name $feature -ErrorAction Stop
        } catch {
            Write-Warning "Could not install $feature. This may be normal on some hosting environments."
        }
    }
}

# Ensure the site is running
Start-Website -Name $SiteName

Write-Host "Deployment complete. The API is available at http://localhost:$Port/api"
Write-Host "To check for detailed error information, look in the event logs or C:\inetpub\logs\FailedReqLogFiles"
