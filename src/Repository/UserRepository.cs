using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StarterKit.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StarterKit.Repository
{
    public class UserRepository : IUserRepository
    {
        private ApplicationDbContext _Context;
        private ILogger _Logger;

        public UserRepository(ApplicationDbContext context, ILoggerFactory loggerFactory)
        {
            _Context = context;
            _Logger = loggerFactory.CreateLogger("UserRepository");
        }

        public async Task<IEnumerable<ApplicationUser>> GetUsersAsync()
        {
            return await _Context.Users.ToListAsync();
        }


        public async Task<ApplicationUser> GetUserByIdAsync(Guid userGuid)
        {
            return await _Context.Users
                .FirstOrDefaultAsync(x => x.UserGuid == userGuid);
        }

        public async Task<ApplicationUser> InsertUserAsync(ApplicationUser user)
        {
            _Context.Add(user);
            try
            {
                await _Context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _Logger.LogError($"Error in {nameof(InsertUserAsync)}: " + ex.Message);
            }

            return user;
        }

        public async Task<bool> UpdateUserAsync(ApplicationUser user)
        {
            _Context.Users.Attach(user);
            _Context.Entry(user).State = EntityState.Modified;
            try
            {
                return (await _Context.SaveChangesAsync() > 0 ? true : false);
            }
            catch (Exception exp)
            {
                _Logger.LogError($"Error in {nameof(UpdateUserAsync)}: " + exp.Message);
            }
            return false;
        }

        public async Task<bool> DeleteUserAsync(Guid id)
        {
            var entity = new ApplicationUser() { UserGuid = id };
            _Context.Attach(entity);
            _Context.Remove(entity);
            try
            {
                return (await _Context.SaveChangesAsync() > 0 ? true : false);
            }
            catch (System.Exception exp)
            {
                _Logger.LogError($"Error in {nameof(DeleteUserAsync)}: " + exp.Message);
            }
            return false;
        }
    }
}
