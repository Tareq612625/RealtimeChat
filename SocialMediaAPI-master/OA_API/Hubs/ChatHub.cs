using Microsoft.AspNetCore.SignalR;
using OA_DataAccess;
using OA_Service;

namespace OA_API.Hubs
{
    public class ChatHub:Hub
    {
        private readonly IMessageService messageService;
        public ChatHub(IMessageService messageService)
        {
            this.messageService = messageService;
        }
        public async Task SendSimpleMessage(string UserId, string FullName, string Username)
        {
            await Clients.All.SendAsync("ReceiveMessage",Username, FullName);
        }
        static IList<UserConnection> Users = new List<UserConnection>();
        public async Task SendMessageToUser(string UserId, string Sender, string Receiver,string Message)
        {
            var messageObj = new Message();
            messageObj.Id = UserId;
            messageObj.Sender = Sender;
            messageObj.Receiver = Receiver;
            messageObj.Content = Message;
            messageObj.MessageDate = DateTime.Now;
            var reciever = Users.FirstOrDefault(x => x.UserId == messageObj.Receiver);
            var connectionId = reciever == null ? "offlineUser" : reciever.ConnectionId;
            this.messageService.Add(messageObj);
            await Clients.Client(connectionId).SendAsync("ReceiveDM", Context.ConnectionId, messageObj);
        }
        public async Task DeleteMessage(string deleteType, string deletedUserId,string id)
        {
            var msg = messageService.GetMessage(id);
            var message = new MessageDeleteModel();
            message.Message= msg;
            message.DeletedUserId = deletedUserId;
            message.DeleteType = deleteType;
            var deletedMessage = await this.messageService.DeleteMessage(message);
            await Clients.All.SendAsync("BroadCastDeleteMessage", Context.ConnectionId, deletedMessage);
        }
       
        public async Task PublishUserOnConnect(string UserId, string FullName, string Username)
        {

            var existingUser = Users.FirstOrDefault(x => x.Username == Username);
            var indexExistingUser = Users.IndexOf(existingUser);

            UserConnection user = new UserConnection
            {
                UserId = UserId,
                ConnectionId = Context.ConnectionId,
                FullName = FullName,
                Username = Username
            };

            if (!Users.Contains(existingUser))
            {
                Users.Add(user);

            }
            else
            {
                Users[indexExistingUser] = user;
            }

            await Clients.All.SendAsync("BroadcastUserOnConnect", Users);

        }
        public async Task PublishUserOnConnectNew(UserConnection obj)
        {

            var existingUser = Users.FirstOrDefault(x => x.Username == obj.Username);
            var indexExistingUser = Users.IndexOf(existingUser);

            UserConnection user = new UserConnection
            {
                UserId = obj.UserId,
                ConnectionId = Context.ConnectionId,
                FullName = obj.FullName,
                Username = obj.Username
            };

            if (!Users.Contains(existingUser))
            {
                Users.Add(user);

            }
            else
            {
                Users[indexExistingUser] = user;
            }

            await Clients.All.SendAsync("BroadcastUserOnConnect", Users);

        }
        public void RemoveOnlineUser(string userID)
        {
            var user = Users.Where(x => x.UserId == userID).ToList();
            foreach (UserConnection i in user)
                Users.Remove(i);

            Clients.All.SendAsync("BroadcastUserOnDisconnect", Users);
        }
    }
}
