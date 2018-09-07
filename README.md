# StarterPack
This Starter template allows you to spin up a React/Redux and .Net Core application with SQL Server and .Net Core Identity Authentication/Authroization. The site takes advantage of Server-Side Rendering and Lazy Loading based on Routes. Authentication is built into the App with JWT and Authorize attributes on controllers. 
 
# Technology Stack
 - .NET Core/ C# 2.1
 - React 16.3/ JavaScript
 - TypeScript
 - Redux
 - Webpack 4
 - SCSS
 - Bootstrap 4
 - Font-Awesome 5
 - Server-Side Rendering(SSR)
 - Lazy Loading(React-Loadable)
 - Hot Module Reloading(HMR)
 - Docker
 - Docker-Compose
 - Azure Resourcee Manager(ARM) Template
 - Key Vault
 - JWT Bearer Token
 
# Setup Dependencies/ Requirements
 - Docker
 
Switch out the values in `appsettings.json` with your own seed account.
 ```
 {
  "Logging": {
    "IncludeScopes": false,
    "Debug": {
      "LogLevel": {
        "Default": "Warning"
      }
    }
  },
  "Console": {
    "LogLevel": {
      "Default": "Warning"
    }
  },
  "BlobService": {
    "StorageUrl": "https://jsstarter.blob.core.windows.net/"
  },
  "ConnectionStrings": {
    "LocalConnection": "Server=db;Database=master;User=sa;Password=[PASSWORD];"
  },
  "Token": {
    "Issuer": "https://jsstarter.azurewebsites.net",
    "Key": "[TOKEN_KEY]"
  },
  "SeedAccount": {
    "UserName": "[ADMIN_EMAIL]",
    "Password": "[PASSWORD]"
  }
}
 ```

# Run Project with Docker
```
docker-compose -f ".\docker-compose.yml" -f ".\docker-compose.override.yml" build

```
This will build two docker containers. One for the web application, and another for the SQL server database. The databae will be seeded with a starting Admin Account to login with. 

# Setup Dependencies/ Requirements without Docker
 - VS 2017 or .Net Core Service Pack
 - Webpack 4
 - Local Database
  
 # Run Project without Docker
 Install Webpack
 - `npm install webpack webpack-cli -g`
 
 Setup Project
 - Navigate to Project Directory
 - `dotnet restore`
 - `dotnet build`
 
 Setup local database
 - add connection string to appsettings.json
 
# Run Project
 - `dotnet run`
 
# Set Environment in PowerShell
 - `$Env:ASPNETCORE_ENVIRONMENT = "Development"`
 - `$Env:ASPNETCORE_ENVIRONMENT = "Production"` 

I will be working to split this template into multiple repos in the future: 
 - One that contains Authentication
 - Move to the new JavaScriptServices React+Redux template folder structure.
 - One that uses Docker
