using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using StarterKit.Models;
using Microsoft.AspNetCore.Identity;
using System.Threading;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;

namespace StarterKit.Repository
{
    public class DbSeeder
    {
        readonly ILogger _Logger;
        readonly IConfiguration _config;
        public DbSeeder(ILoggerFactory loggerFactory, IConfiguration config)
        {
            _Logger = loggerFactory.CreateLogger("DbSeederLogger");
            _config = config;
        }

        public async Task SeedAsync(IServiceProvider serviceProvider, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, CancellationToken cancellationToken)
        {
            //Based on EF team's example at https://github.com/aspnet/MusicStore/blob/dev/samples/MusicStore/Models/SampleData.cs
            using (var serviceScope = serviceProvider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var db = serviceScope.ServiceProvider.GetService<ApplicationDbContext>();
                await db.Database.EnsureCreatedAsync();
                
                var _userManager = userManager;
                var _roleManager = roleManager;
                string[] roleNames = { "Admin", "Member", "Guest" };
                IdentityResult roleResult;

                List<ApplicationUser> _users = new List<ApplicationUser>
                {
                    new ApplicationUser()
                    {
                        UserName=_config["SeedAccount:UserName"],
                        FirstName = "FirstName",
                        LastName = "LastName",
                        Email = _config["SeedAccount:UserName"],
                        SecurityStamp=Guid.NewGuid().ToString()
                    }
                };

                foreach (var roleName in roleNames)
                {
                    var roleExist = await _roleManager.RoleExistsAsync(roleName);
                    //check if role exists
                    if (!roleExist)
                    {
                        // create new role
                        roleResult = await _roleManager.CreateAsync(new IdentityRole(roleName));
                    }
                }
                if (!await db.Users.AnyAsync())
                {
                    foreach (ApplicationUser _user in _users)
                    {
                        // create user
                        await _userManager.CreateAsync(_user, _config["SeedAccount:Password"]);
                        //add user to "Member" role
                        await _userManager.AddClaimAsync(_user, new Claim(ClaimTypes.Role, "Member"));
                        await _userManager.AddClaimAsync(_user, new Claim(ClaimTypes.Role, "Admin"));
                    }
                }
            }
        }
    }
}
