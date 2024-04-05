using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OA_DataAccess
{
    public class TblRefreshtoken
    {
        [Key]
        public string UserId { get; set; }
        public string TokenId { get; set; }
        public string RefreshToken { get; set; }
        public int IsActive { get; set; }
    }
    public class TokenResponse
    {
        [Key]
        public string? JWTToken { get; set; }
        public string? RefreshToken { get; set; }
        public virtual User User { get; set; }
    }
}
