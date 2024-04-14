Real Time Chat Applicaton
-----------------------------------
This is a real-time chat application built with Angular, ASP.NET Core, SignalR, and SQL Server, following the Onion Architecture. It has the following functionalities:

1.As a new user, you can register with your email address, first name, and last name.

2.Registered users can log in with their email address.

3.Logged-in users can see a user list and initiate chats. Chat always occurs between two users.

4.Users can view chat history.

5.The application has sign-out functionality.

Technologies
-----------------------------------
1.ASP.NET Core 6

2.Entity Framework Core 6

3.Angular 17

4.Signal R

5.Sql Server

6.Web API

7.Bootstrap

8.HTML

9.CSS

Development Environment Setup
---------------------------------------
1.Install Latest Microsoft SQL Server

2.Install Visual Studio 2022

3.Install VS Code latest 

4.Install the latest .NET Core 6 SDK

5.Install the latest Node.js LTS

6.Run npm install -g @angular/cli to install latest version of angular CLI

7.Download source code from https://github.com/Tareq612625/RealtimeChat

8.Run Web API application

9.Run Angular Project
    
10.Browse http://localhost:4500 to view real time chat app in browser

Database Configuration ( MSSQL Server )
---------------------------------------
Update the ConnectionString int appsettings.json , so that application can point to a valid SQL Server instance.

  "ConnectionStrings": {
  "DefaultConnection": "Data Source=your server name;Initial Catalog=dbname;User ID=sa;Password=123;Integrated Security=false;MultipleActiveResultSets=True;TrustServerCertificate=True"
}
When you run update-database command, the migrations will be applied and the database will be automatically created.

![API](https://github.com/Tareq612625/RealtimeChat/assets/61448480/6271e613-743b-472e-b86f-7a1054d5798b)

![Registration](https://github.com/Tareq612625/RealtimeChat/assets/61448480/40b8cc4e-d248-4295-b4a7-308a2f21f503)


![Login](https://github.com/Tareq612625/RealtimeChat/assets/61448480/07edcbb1-708f-4939-9eef-12574d94bfc4)

![MessagePage](https://github.com/Tareq612625/RealtimeChat/assets/61448480/404514ce-dc5b-4068-bd63-55f618b47943)

![ChatPage](https://github.com/Tareq612625/RealtimeChat/assets/61448480/96777c6b-a594-4d33-8375-35bb611068c1)

![ChattedUserPage](https://github.com/Tareq612625/RealtimeChat/assets/61448480/5b4799d0-e23b-49f0-bd19-bdc19e5122b9)

![RemoveMessage](https://github.com/Tareq612625/RealtimeChat/assets/61448480/1f999904-071b-43ec-9b12-933bbffd5657)

