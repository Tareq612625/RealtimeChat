using OA_DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OA_Service
{
    public interface IUserService
    {
        TblRefreshtoken TokenCheck(string UserId, string RefreshToken);
        string GenerateToken(string username);
        IEnumerable<User>  GetAll();
        User GetById(string email);
        void Insert(User entity);
        void Update(User entity);
        void Delete(User entity);
    }
}
