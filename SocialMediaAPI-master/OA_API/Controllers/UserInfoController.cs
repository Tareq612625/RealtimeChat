using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using Microsoft.IdentityModel.Tokens;
using OA_DataAccess;
using OA_Repository;
using OA_Service;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace OA_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class UserInfoController : ControllerBase
    {
        private readonly IUserService _UserService;
        private readonly JwtSettings jwtSettings;
        public UserInfoController(IUserService UserService)
        {
            _UserService = UserService;
        }
       

        [HttpPost(nameof(Login))]
        public IActionResult Login(LoginModel obj)
        {
            TokenResponse tokenResponse = new TokenResponse();

            var loginInfo = _UserService.GetAll().Where(c=>c.Email==obj.Email).FirstOrDefault();
            if (loginInfo == null)
            {
                return Unauthorized();
            }
            else
            {
                /// Generate Token
                var tokenhandler = new JwtSecurityTokenHandler();
                var tokenkey = Encoding.UTF8.GetBytes("thisisoursecurekey");
                var tokendesc = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[] { new Claim(ClaimTypes.Email, loginInfo.Email.ToString()) }),
                    Expires = DateTime.Now.AddMinutes(5),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(tokenkey), SecurityAlgorithms.HmacSha256)
                };
                var token = tokenhandler.CreateToken(tokendesc);
                string finalToken = tokenhandler.WriteToken(token);

                tokenResponse.JWTToken = finalToken;
                tokenResponse.User = loginInfo;
                tokenResponse.RefreshToken = _UserService.GenerateToken(loginInfo.Email.ToString());

                return Ok(tokenResponse);
            }

        }
        [NonAction]
        public TokenResponse Authenticate(string username, Claim[] claims)
        {
            TokenResponse tokenResponse = new TokenResponse();
            var tokenkey = Encoding.UTF8.GetBytes("thisisoursecurekey");
            var tokenhandler = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(15),
                 signingCredentials: new SigningCredentials(new SymmetricSecurityKey(tokenkey), SecurityAlgorithms.HmacSha256)

                );
            tokenResponse.JWTToken = new JwtSecurityTokenHandler().WriteToken(tokenhandler);
            tokenResponse.RefreshToken = _UserService.GenerateToken(username);

            return tokenResponse;
        }
        //[Route("Refresh")]
        [HttpPost(nameof(Refresh))]
        public IActionResult Refresh([FromBody] TokenResponse token)
        {

            var tokenHandler = new JwtSecurityTokenHandler();
            var securityToken = (JwtSecurityToken)tokenHandler.ReadToken(token.JWTToken);
            var username = securityToken.Claims.FirstOrDefault(c => c.Type == "unique_name")?.Value;


            //var username = principal.Identity.Name;
            var _reftable = _UserService.TokenCheck(username, token.RefreshToken);
            if (_reftable == null)
            {
                return Unauthorized();
            }
            TokenResponse _result = Authenticate(username, securityToken.Claims.ToArray());
            return Ok(_result);
        }

        [HttpGet(nameof(GetUserById))]
        public IActionResult GetUserById(string email)
        {
            var obj = _UserService.GetById(email);
            if (obj == null)
            {
                return  NotFound();
            }
            else
            {
                return  Ok(obj);
            }
        }
        [HttpGet(nameof(GetAllUser))]
        public IActionResult GetAllUser()
        {
            var obj = _UserService.GetAll();
            if (obj == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(obj);
            }
        }
        [HttpPost(nameof(CreateUser))]
        public IActionResult CreateUser(User UserInfo)
        {
            if (UserInfo != null)
            {
                _UserService.Insert(UserInfo);
                return Ok(new { success = true, message = "Registration successful" });
            }
            else
            {
                return BadRequest(new { success = false, message = "Invalid user information" });
            }
        }
        [HttpPut(nameof(UpdateUser))]
        public IActionResult UpdateUser(User UserInfo)
        {
            if (UserInfo != null)
            {
                _UserService.Update(UserInfo);
                return Ok("Update Successfully");
            }
            else
            {
                return BadRequest("Somethingwent wrong");
            }
        }
        [HttpDelete(nameof(DeleteUser))]
        public IActionResult DeleteUser(User UserInfo)
        {
            if (UserInfo != null)
            {
                _UserService.Delete(UserInfo);
                return Ok("Remove Successfully");
            }
            else
            {
                return BadRequest("Somethingwent wrong");
            }
        }
    }
}
