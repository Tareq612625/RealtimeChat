using OA_DataAccess;
using OA_Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace OA_Service
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _applicationDbContext;
        public UserService(ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
        }
        public TblRefreshtoken TokenCheck(string UserId, string RefreshToken)
        {
            return _applicationDbContext.TblRefreshtoken.Where(c => c.UserId == UserId && c.RefreshToken == RefreshToken).FirstOrDefault();
        }
        public string GenerateToken(string username)
        {
            var randomnumber = new byte[32];
            using (var randomnumbergenerator = RandomNumberGenerator.Create())
            {
                randomnumbergenerator.GetBytes(randomnumber);
                string RefreshToken = Convert.ToBase64String(randomnumber);

                var _user = _applicationDbContext.TblRefreshtoken.FirstOrDefault(o => o.UserId == username);
                if (_user != null)
                {
                    _user.RefreshToken = RefreshToken;
                    _applicationDbContext.SaveChanges();
                }
                else
                {
                    TblRefreshtoken tblRefreshtoken = new TblRefreshtoken()
                    {
                        UserId = username,
                        TokenId = new Random().Next().ToString(),
                        RefreshToken = RefreshToken,
                        IsActive = 1
                    };
                    _applicationDbContext.Add(tblRefreshtoken);
                    _applicationDbContext.SaveChanges(true);
                }

                return RefreshToken;
            }
        }


        public void Delete(User entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }
            _applicationDbContext.User.Remove(entity);
            _applicationDbContext.SaveChanges();
        }

        public IEnumerable<User> GetAll()
        {
            return _applicationDbContext.User.AsEnumerable();
        }

        public User GetById(string email)  
        {
            return _applicationDbContext.User.FirstOrDefault(c => c.Email == email);
        }

        public void Insert(User entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }
            _applicationDbContext.User.Add(entity);
            _applicationDbContext.SaveChanges();
        }

        public void Remove(User entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }
            _applicationDbContext.User.Remove(entity);
        }

        public void SaveChanges()
        {
            _applicationDbContext.SaveChanges();
        }

        public void Update(User entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }
            _applicationDbContext.User.Update(entity);
            _applicationDbContext.SaveChanges();
        }
    }
}
