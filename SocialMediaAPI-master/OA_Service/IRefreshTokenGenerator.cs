using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OA_Service
{
    public interface IRefreshTokenGenerator
    {
        string GenerateToken(string username);
    }
}
