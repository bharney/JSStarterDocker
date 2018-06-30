# StarterPack
Application for allowing user to login, enter their expenses, and revenue to calculate their expected spending money per month.

#UI Elements
 - Menu
   - Navigation Slider
   - Navigation Sidebar
   - Nav menu should have an Icon and say "Menu"
   - Menu Items are active for Current Page
 - Breadcrumbs for page navigation
 - Login
 - Admin Panel
- Mobile Responsive
 
#Data Access
 - Ability to open a DB Connection via Entity Framework
 - DB Migrations

#Setup Dependencies/ Requirements
 - VS 2017 or .Net Core Service Pack
 - Webpack 4
 - Node-Sass
 
 For Webpack and Node-Sass
 `npm install webpack webpack-cli node-sass -g`
 
 #Setup Project
 - Navigate to Project Directory
 - `dotnet restore`
 - `npm install`
 
 #Set Environment in PowerShell
 - `$Env:ASPNETCORE_ENVIRONMENT = "Development"`
 - `$Env:ASPNETCORE_ENVIRONMENT = "Production"`
 
 #Build Bundle and Vendor Bundle
 - `webpack`
 
 #Run Project
 - `dotnet run`
 
#Technology Stack
 - .NET Core/ C#
 - React 16.3/ JavaScript
 - TypeScript
 - Webpack 4
 - SCSS
 - Bootstrap 4
 - Font-Awesome 5
 - Server-Side Rendering
 - Lazy Loading
 
 #Optimizations
 - Compression
   - gzip
   - Images
   - Uglified/ Removed Whitespace/ Comments
   - Non Render-Blocking JS
   - Non Render-Blocking CSS
