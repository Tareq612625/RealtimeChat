import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import {  Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import {MessageService} from '../../service/message.service'
import {UserService} from '../../service/user.service'
import { Guid } from 'guid-typescript';
import { environment } from '../../environments/environment';
import { Console } from 'console';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  messageObj: any = {
    "message": ""
  };
  readonly ChatHubURI = environment.chatHubUrl
  loggedInUserInfo = JSON.parse(localStorage.getItem("login-user") ?? "{}");
  users: any[] = [];
  private hubConnection: HubConnection;
  user: any;
  messages: any[] = [];
  displayMessages: any[] = [];
  connectedUsers: any[] = [];
  chatUser:any;
  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService,
    private userService: UserService 
    ) 
  {
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(environment.chatHubUrl)
    .build();
  }

ngOnInit() {
     this.messageService.getUserReceivedMessages(this.loggedInUserInfo.id).subscribe((item:any)=>{
       if(item){
         this.messages=item;
         this.messages.forEach(x=>{
          x.type=x.receiver==this.loggedInUserInfo.id?'recieved':'sent';
         })       
         console.log(this.messages);
       }
     })

this.userService.getAllUsers().subscribe(
  (data:any) => {
    if(data){
      const array = Object.values(data);
      for (let i = 0; i < array.length; i++) {
        const obj = array[i];
        this.users.push(obj);
      }     
    this.users=this.users.filter(x=>x.email!==this.loggedInUserInfo.email);
    this.users.forEach(item=>{
      item['isActive']=false;
    })
    this.makeItOnline();
    }
  },
  err => {
    console.log(err);
  },
);
var obj = {
  UserId:this.loggedInUserInfo.id,
  FullName: this.loggedInUserInfo.firstName,
  Username:this.loggedInUserInfo.email
};
this.hubConnection = new HubConnectionBuilder().withUrl(environment.chatHubUrl).build();
const self = this;
this.hubConnection.start()
  .then(() => {
    self.hubConnection.invoke("PublishUserOnConnect", this.loggedInUserInfo.id.toString(), this.loggedInUserInfo.firstName.toString(), this.loggedInUserInfo.email.toString())
    .then(() => console.log('User connected successfully'))
    .catch(err => console.error('Error connecting user:', err));

    this.hubConnection.on("BroadcastUserOnConnect", Usrs => {
      this.connectedUsers = Usrs;
      this.makeItOnline();
    });
    this.hubConnection.on("BroadcastUserOnDisconnect", Usrs => {
      this.connectedUsers = Usrs;
      this.makeItOnline();
    });
  })
  .catch(err => console.log(err));

  this.hubConnection.on('BroadCastDeleteMessage', (connectionId, message) => {
    let deletedMessage = this.messages.find(x => x.id === message.id);
    if (deletedMessage) {
      deletedMessage.isReceiverDeleted = message.isReceiverDeleted;
      deletedMessage.isSenderDeleted = message.isSenderDeleted;
      if (deletedMessage.isReceiverDeleted && deletedMessage.receiver === this.chatUser.id) {
        this.displayMessages=this.messages.filter(x => (x.type == 'sent' && x.sender == this.loggedInUserInfo.id && x.receiver == this.chatUser.id) || (x.type == 'recieved' && x.sender == this.chatUser.id && x.receiver == this.loggedInUserInfo.id));
      }
    }
  });

  this.hubConnection.on('ReceiveDM', (connectionId, message) => {
    message.type = 'recieved';
    this.messages.push(message);
    let curentUser = this.users.find(x => x.id == message.sender);
    this.chatUser = curentUser;
    this.users.forEach(item => {
      item['isActive'] = false;
    });
    var user = this.users.find(x => x.id == this.chatUser.id);
    user['isActive'] = true;
    this.displayMessages = this.messages.filter(x => (x.type === 'sent' && x.receiver == this.chatUser.id) || (x.type === 'recieved' && x.sender == this.chatUser.id));
  })
}


SendDirectMessage() {
  if (this.messageObj.message != '' && this.messageObj.message.trim() != '') {
    let guid = Guid.create();
    var msg = {
      Id: guid.toString(),
      Sender: this.loggedInUserInfo.id,
      Receiver: this.chatUser.id,
      MessageDate: new Date(),
      Message: this.messageObj.message,
      ReceiverMessage: this.messageObj.message,
      m:this.messageObj.Message
    };
    var msg1 = {
      id:guid.toString(),
      sender: this.loggedInUserInfo.id,
      receiver: this.chatUser.id,
      messageDate: new Date(),
      type: 'sent',
      content: this.messageObj.message  
    };

    this.messages.push(msg1);
    this.displayMessages= this.messages.filter(x => (x.type == 'sent' && x.sender == this.loggedInUserInfo.id && x.receiver == this.chatUser.id) || (x.type == 'recieved' && x.sender == this.chatUser.id && x.receiver == this.loggedInUserInfo.id));
this.hubConnection.invoke('SendMessageToUser', guid.toString(), msg.Sender.toString(), msg.Receiver.toString(),msg.Message.toString())
      .then(() => {
        console.log('Message to user Sent Successfully');
        this.messageObj.message = '';
      })
      .catch(err => console.error(err));
  }
}

  // SendDirectMessage() {
  //   if (this.messageObj.message != '' && this.messageObj.message.trim() != '') {
  //     let guid=Guid.create();
  //     var msg = {
  //       Id:guid.toString(),
  //       Sender: this.loggedInUserInfo.id,
  //       Receiver:this.chatUser.id,
  //       MessageDate: new Date(),
  //       //type: 'sent',
  //       Content: this.messageObj.message
  //     };
  //     this.messages.push(msg);
  //     this.displayMessages = this.messages.filter(x => (x.type === 'sent' && x.receiver === this.chatUser.id) || (x.type === 'recieved' && x.sender === this.chatUser.id));
  //     console.log(msg)
  //     console.log(this.loggedInUserInfo.id)
  //     console.log(this.chatUser.id)
  //     console.log(this.messageObj.message)
  //     this.hubConnection.invoke('SendMessageToUserNew', guid.toString(),this.loggedInUserInfo.id.toString(),this.chatUser.id.toString(),new Date(),this.messageObj.message)
  //       .then(() => console.log('Message to user Sent Successfully'))
  //       .catch(err => console.error(err));
  //   }
  // }
  openChat(user: any): void {
    user.isActive = true;
    this.chatUser = user;
    this.displayMessages = this.messages.filter(x => (x.type == 'sent' && x.sender == this.loggedInUserInfo.id && x.receiver == this.chatUser.id) || (x.type == 'recieved' && x.sender == this.chatUser.id && x.receiver == this.loggedInUserInfo.id));
  console.log( this.displayMessages)
  }
   makeItOnline() {
    if (this.connectedUsers && this.users) {
      this.connectedUsers.forEach(item => {
        var u = this.users.find(x => x.userName == item.username);
        if (u) {
          u.isOnline = true;
        }
      })
    }
  }

  deleteMessage(message: any, deleteType: string, isSender: boolean) {
    let deleteMessage = {
      'deleteType': deleteType,
      'message': message,
      'deletedUserId': this.loggedInUserInfo.id
    };
    this.hubConnection.invoke('DeleteMessage', deleteMessage.deleteType.toString(),deleteMessage.deletedUserId.toString(),message.id)
      .then(() => console.log('publish delete request'))
      .catch(err => console.error(err));
    message.isSenderDeleted = isSender;
    message.isReceiverDeleted = !isSender;
  }
  

  onLogout() {
    this.hubConnection.invoke("RemoveOnlineUser", this.loggedInUserInfo.id)
      .then(() => {
        this.messages.push('User Disconnected Successfully')
      })
      .catch(err => console.error(err));
    localStorage.removeItem('login-user');
    this.router.navigateByUrl('/login');
  }
}