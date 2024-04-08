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

9.Run Web API application

10. Run Angular Project
    
11. Browse http://localhost:4500 to view real time chat app in browser

Database Configuration ( MSSQL Server )
---------------------------------------
Update the ConnectionString int appsettings.json , so that application can point to a valid SQL Server instance.

  "ConnectionStrings": {
  "DefaultConnection": "Data Source=your server name;Initial Catalog=dbname;User ID=sa;Password=123;Integrated Security=false;MultipleActiveResultSets=True;TrustServerCertificate=True"
}
When you run update-database command, the migrations will be applied and the database will be automatically created.
