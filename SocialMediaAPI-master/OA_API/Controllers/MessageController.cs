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
    public class MessageController : ControllerBase
    {
        private readonly IMessageService _messageService;
        public MessageController(IMessageService _messageService)
        {
            this._messageService = _messageService;
        }

        [HttpGet(nameof(GetAll))]
        public IActionResult GetAll()
        {
            var obj = _messageService.GetAll();
            if (obj == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(obj);
            }
        }
        [HttpGet(nameof(GetUserReceivedMessages))]
        public IActionResult GetUserReceivedMessages(string userId)
        {
            var obj = _messageService.GetReceivedMessages(userId);
            if (obj == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(obj);
            }
        }
        [HttpPost(nameof(DeleteMessage))]
        public async Task<IActionResult> DeleteMessage([FromBody] MessageDeleteModel messageDeleteModel)
        {
            var message = await _messageService.DeleteMessage(messageDeleteModel);
            return Ok(message);
        }

    }
}
