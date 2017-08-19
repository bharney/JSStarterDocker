# StarterPack
Application for allowing user to login, enter their expenses, and revenue to calculate their expected spending money per month.

#Setup Dependencies/ Requirements
 - VS 2017 or .Net Core Service Pack
 - Webpack 2
 - Node-Sass
 
 For Webpack and Node-Sass
 `npm install webpack node-sass -g`
 
 #Setup Project
 - Navigate to Project Directory
 - `dotnet restore`
 - `npm install`
 
 #Set Environment in PowerShell
 - `$Env:ASPNETCORE_ENVIRONMENT = "Development"`
 - `$Env:ASPNETCORE_ENVIRONMENT = "Production"`
 
 #Build Bundle and Vendor Bundle
 - `webpack --config webpack.config.vendor.js `
 - `webpack`
 
 #Run Project
 - `dotnet run`
 
#Technology Stack
 - .NET Core/ C#
 - React/ JavaScript
 - TypeScript
 - Webpack 2
 - SCSS
 - Bootstrap 4
 - Font-Awesome
 - Google Font
 - Server-Side Rendering
 
 #Build
 - Compression
   - gzip
   - Images
   - Whitespace
   - Comments
   - Non Render-Blocking JS
   - Non Render-Blocking CSS
