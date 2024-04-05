using Microsoft.EntityFrameworkCore;
using OA_DataAccess;
using OA_Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OA_Service
{
    public class MessageService:IMessageService
    {
        private readonly ApplicationDbContext _applicationDbContext;
        public MessageService(ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
        }
        IEnumerable<Message> IMessageService.GetAll()
        {
            try
            {
                var messages = _applicationDbContext.Message.ToList();
                return messages;
            }
            catch (Exception)
            {

                throw;
            }

        }
        IEnumerable<Message> IMessageService.GetReceivedMessages(string userId)
        {
            try
            {
                var messages = _applicationDbContext.Message.Where(x => x.Receiver == userId).ToList();
                return messages;
            }
            catch (Exception)
            {

                throw;
            }

        }
        public void Add(Message message)
        {
            _applicationDbContext.Message.Add(message);
            _applicationDbContext.SaveChanges();
        }
        async Task<Message> IMessageService.DeleteMessage(MessageDeleteModel messageDeleteModel)
        {
            var message = await _applicationDbContext.Message.Where(x => x.Id == messageDeleteModel.Message.Id).FirstOrDefaultAsync();
            if (messageDeleteModel.DeleteType == DeleteTypeEnum.DeleteForEveryone.ToString())
            {
                message.IsReceiverDeleted = true;
                message.IsSenderDeleted = true;
            }
            else
            {
                message.IsReceiverDeleted = message.IsReceiverDeleted || (message.Receiver == messageDeleteModel.DeletedUserId);
                message.IsSenderDeleted = message.IsSenderDeleted || (message.Sender == messageDeleteModel.DeletedUserId);
            }
            _applicationDbContext.Message.Update(message);
            await _applicationDbContext.SaveChangesAsync();
            return message;
        }
        public enum DeleteTypeEnum
        {
            DeleteForMe,
            DeleteForEveryone
        }
    }
}
