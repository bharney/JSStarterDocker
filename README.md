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
This will build two docker containers. One for the web application, and another for the SQL server database. The database will be seeded with a starting Admin Account to login with. 

# Run Project
 - `dotnet run`
 
# Set Environment in PowerShell
 - `$Env:ASPNETCORE_ENVIRONMENT = "Development"`
 - `$Env:ASPNETCORE_ENVIRONMENT = "Production"` 

# Road Map
I am working to split this template into repos the correspond to the ARM templating. That is one that spins up Azure Resources needed for Docker, and one that spins up more of a classic application without docker
 - [The project without docker can be found here called JSStarter](https://github.com/bharney/JSStarter)
 - One that uses Docker. Thats this one.

