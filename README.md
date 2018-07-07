# StarterPack
Starter template using React/Redux and .Net Core. The site takes advantage of Server-Side Rendering and Lazy Loading based on Routes. Authentication is built into the App with JWT and Authorize attributes on controllers. I will be working to split this template into two repos. One that contains Authentication, and another that looks more like the JavaScriptServices React+Redux template.
 
# Technology Stack
 - .NET Core/ C#
 - React 16.3/ JavaScript
 - TypeScript
 - Redux
 - Webpack 4
 - SCSS
 - Bootstrap 4
 - Font-Awesome 5
 - Server-Side Rendering
 - Lazy Loading
 
# Setup Dependencies/ Requirements
 - VS 2017 or .Net Core Service Pack
 - Webpack 4
 - Local Database
 
 Install Webpack
 `npm install webpack webpack-cli -g`
 
 Setup Project
 - Navigate to Project Directory
 - `dotnet restore`
 - `npm install`
 
 Add `appsettings.json` to Root Directory
 ```
 {
  "Logging": {
    "IncludeScopes": false,
    "Debug": {
      "LogLevel": {
        "Default": "Warning"
      }
    },
    "Console": {
      "LogLevel": {
        "Default": "Warning"
      }
    }
  },
  "ConnectionStrings": {
    "SqlServerConnectionString": [YOUR_CONNECTION_STRING]
  },
  "Tokens": {
    "Key": [JWT_KEY],
    "Issuer": [JWT_ISSUER]
  },
}
 ```
 Run Initial Database Migration
 - `Update-Database`
 
 Build Bundle
 - `webpack`
 
# Run Project
 - `dotnet run`
 
# Set Environment in PowerShell
 - `$Env:ASPNETCORE_ENVIRONMENT = "Development"`
 - `$Env:ASPNETCORE_ENVIRONMENT = "Production"` 

# TODO
- [] Setup Dockerfile to allow users to simply run docker to setup a database and all dependencies.
