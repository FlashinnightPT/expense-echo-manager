
# PowerShell script to run SQL migrations

param (
    [string]$Server = "94.46.168.180",
    [string]$Database = "GFIN_DB",
    [string]$Username = "gfin_admin",
    [string]$Password = "P@gu89_lo#",
    [switch]$CreateTables
)

# Define the SQL for creating tables if they don't exist
$createTablesSql = @"
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(255) PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  parentid VARCHAR(255),
  level INT NOT NULL DEFAULT 1,
  createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isactive TINYINT(1) DEFAULT 1,
  isfixedexpense TINYINT(1) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS transactions (
  id VARCHAR(255) PRIMARY KEY,
  date DATE NOT NULL,
  createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  amount DECIMAL(10, 2) NOT NULL,
  description VARCHAR(255) NOT NULL,
  categoryid VARCHAR(255),
  type VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255),
  role VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  last_login TIMESTAMP NULL
);
"@

# Function to execute SQL
function Execute-SQL {
    param (
        [string]$sql
    )
    
    try {
        # Download mysql.exe if it doesn't exist
        $mysqlExe = ".\mysql.exe"
        if (!(Test-Path $mysqlExe)) {
            Write-Host "MySQL client not found. Downloading..."
            $url = "https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.33-winx64.zip"
            $zipFile = ".\mysql.zip"
            
            Invoke-WebRequest -Uri $url -OutFile $zipFile
            Expand-Archive -Path $zipFile -DestinationPath ".\mysql-temp" -Force
            
            $mysqlBinPath = Get-ChildItem -Path ".\mysql-temp" -Recurse -Filter "mysql.exe" | Select-Object -First 1 -ExpandProperty FullName
            Copy-Item -Path $mysqlBinPath -Destination $mysqlExe
            
            Remove-Item -Path $zipFile -Force
            Remove-Item -Path ".\mysql-temp" -Recurse -Force
        }
        
        # Create a temporary file with the SQL
        $tempFile = [System.IO.Path]::GetTempFileName()
        Set-Content -Path $tempFile -Value $sql
        
        # Execute the SQL
        $arguments = "--host=$Server --user=$Username --password=$Password --database=$Database < `"$tempFile`""
        $command = "cmd.exe /c $mysqlExe $arguments"
        
        Write-Host "Executing SQL: $command"
        Invoke-Expression $command
        
        # Clean up
        Remove-Item -Path $tempFile -Force
        
        Write-Host "SQL executed successfully."
    } catch {
        Write-Host "Error executing SQL: $_"
    }
}

# Main script execution
if ($CreateTables) {
    Write-Host "Creating tables if they don't exist..."
    Execute-SQL -sql $createTablesSql
}

Write-Host "Migration complete."
