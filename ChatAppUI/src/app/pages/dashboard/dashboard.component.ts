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

  loggedInUserInfo = JSON.parse(localStorage.getItem("login-user") ?? "{}");
  //loggedInUserInfo = localStorage.getItem("login-user");
  private hubConnection: HubConnection;
  user: any; // Define a variable to store user information
  messages: any[] = [];
  displayMessages: any[] = [];
  connectedUsers: any[] = [];
  users:any;
  chatUser:any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService,
    private userService: UserService 
    ) 
  {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7234/ChatHub')
      .build();
  }
ngOnInit() {
  console.log(this.loggedInUserInfo)
  // const loggedInUser = localStorage.getItem('User');
  // if (!loggedInUser) {
  //   // Handle the case where the user is not logged in
  //   return;
  // }
     this.messageService.getUserReceivedMessages(this.loggedInUserInfo.id).subscribe((item:any)=>{
       if(item){
         this.messages=item;
         this.messages.forEach(x=>{
          x.type=x.receiver===this.loggedInUserInfo.id?'recieved':'sent';
         })
         console.log(this.messages);
       }
     })

//   this.http.get('https://localhost:7234/api/UserInfo/GetAllUser').subscribe(
//     (user: any) => {
//       if(user){
//        //this.users=user.filter(x=>x.email!==this.loggedInUserInfo);
//         // this.users.forEach(item=>{
//         //   item['isActive']=false;
//         // })
//         this.makeItOnline();
//         }
//     },
//     err => {
//         console.log(err);
//     }
// );
this.userService.getAllUsers().subscribe(
  (user: any) => {
    if (user) {
      this.users = user;
      this.makeItOnline();
    }
  },
  err => {
    console.log(err);
  }
);

  this.hubConnection = new HubConnectionBuilder().withUrl('https://localhost:7234/ChatHub').build();
  const self = this;
  this.hubConnection.start()
    .then(() => {
      self.hubConnection.invoke("PublishUserOnConnect", this.loggedInUserInfo.id, this.loggedInUserInfo.firstName, this.loggedInUserInfo.userName)
        .then(() => console.log('User Sent Successfully'))
        .catch(err => console.error(err));

      this.hubConnection.on("BroadcastUserOnConnect", Usrs => {
        this.connectedUsers = Usrs;
        this.makeItOnline();
      });
      this.hubConnection.on("BroadcastUserOnDisconnect", Usrs => {
        this.connectedUsers = Usrs;
        // this.users.forEach(item => {
        //   item.isOnline = false;
        // });
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
        this.displayMessages = this.messages.filter(x => (x.type === 'sent' && x.receiver === this.chatUser.id) || (x.type === 'received' && x.sender === this.chatUser.id));
      }
    }
  });

  this.hubConnection.on('ReceiveDM', (connectionId, message) => {
    console.log(message);
    message.type = 'received';
    this.messages.push(message);
    //let curentUser = this.users.find(x => x.id === message.sender);
    //this.chatUser = curentUser;
    // this.users.forEach(item => {
    //   item['isActive'] = false;
    // });
    // var user = this.users.find(x => x.id == this.chatUser.id);
    // user['isActive'] = true;
    this.displayMessages = this.messages.filter(x => (x.type === 'sent' && x.receiver === this.chatUser.id) || (x.type === 'received' && x.sender === this.chatUser.id));
  });
}

  
  SendDirectMessage() {
    if (this.messageObj.message != '' && this.messageObj.message.trim() != '') {
      let guid=Guid.create();
      var msg = {
        id:guid.toString(),
        sender: this.loggedInUserInfo.id,
        receiver:this.chatUser.id,
        messageDate: new Date(),
        type: 'sent',
        content: this.messageObj.message
      };
      this.messages.push(msg);
      this.displayMessages = this.messages.filter(x => (x.type === 'sent' && x.receiver === 'jhon@gmail.com') || (x.type === 'recieved' && x.sender ==='mdazizkhn@gmail.com'));
      //console.log(this.displayMessages)
      this.hubConnection.invoke('SendMessageToUser', msg)
        .then(() => console.log('Message to user Sent Successfully'))
        .catch(err => console.error(err));
    }
  }
  // openChat(user) {
  //   // this.users.forEach(item => {
  //   //   item['isActive'] = false;
  //   // });
  //   user['isActive'] = true;
  //   this.chatUser = user;
  //   this.displayMessages = this.messages.filter(x => (x.type === 'sent' && x.receiver === this.chatUser.id) || (x.type === 'recieved' && x.sender === this.chatUser.id));;
  // }
   makeItOnline() {
    if (this.connectedUsers && this.users) {
      this.connectedUsers.forEach(item => {
        // var u = this.users.find(x => x.userName == item.username);
        // if (u) {
        //   u.isOnline = true;
        // }
      })
    }
  }

  deleteMessage(message: any, deleteType: string, isSender: boolean) {
    let deleteMessage = {
      'deleteType': deleteType,
      'message': message,
      'deletedUserId': this.loggedInUserInfo.id
    };
    this.hubConnection.invoke('DeleteMessage', deleteMessage)
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