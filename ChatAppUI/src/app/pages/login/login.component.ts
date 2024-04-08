import { Component } from '@angular/core';
import {  Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  loginObj: any = {
    "email": ""
  };

  RegnObj: any = {
    "firstName": "",
    "lastName": "",
    "email": "",
    "isOnline": true
  };
  
  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  onLogin() {
    this.userService.loginUser(this.loginObj).subscribe((res: any) => {
      if (res.jwtToken) {
        console.log(res.jwtToken);
        alert('login Success');
        localStorage.setItem('loginTOken', res.jwtToken);
        localStorage.setItem('RefreshToken', res.refreshToken);
        localStorage.setItem('User', res.user.email);
        localStorage.setItem('login-user', JSON.stringify(res.user));
        this.router.navigateByUrl('/dashboard'); 
        console.log(JSON.stringify(res.user));
        console.log(res.user.email);
      } else {
        alert(res.message);
      }
    });
  }

  onRegistration() {
    this.userService.createUser(this.RegnObj).subscribe((res: any) => {
      if (res && res.success) {
        console.log(res);
        alert('Registration Success');
        this.router.navigateByUrl('/login');
      } else {
        alert(res.message);
      }
    });
  }
}

// export class LoginComponent {
//   loginObj: any = {
//     "email": ""
//   };
//   RegnObj: any = {
//     "firstName": "",
//     "lastName": "",
//     "email": "",
//     "isOnline": true
//   };
//   constructor(private http: HttpClient, private router: Router){}

//   onLogin() {
//     this.http.post('https://localhost:7234/api/UserInfo/Login', this.loginObj).subscribe((res:any)=>{
//       if(res.jwtToken) {
//         console.log(res.jwtToken)
//         alert('login Success');
//         localStorage.setItem('loginTOken', res.jwtToken);
//         localStorage.setItem('RefreshToken', res.refreshToken);
//         localStorage.setItem('User', res.user.email);
//         //localStorage.setItem('login-user', res.user);
//         localStorage.setItem('login-user', JSON.stringify(res.user));
//         this.router.navigateByUrl('/dashboard'); 
//         console.log(JSON.stringify(res.user))
//         console.log(res.user.email)
//       } else {
//         alert(res.message);
//       }
//     })
//   }
//   onRegistration() {
//     console.log(this.RegnObj);
//     this.http.post('https://localhost:7234/api/UserInfo/CreateUser', this.RegnObj).subscribe((res:any)=>{
//       if (res && res.success) {
//         console.log(res);
//         alert('Registration Success');
//         this.router.navigateByUrl('/login');
//       } else {
//         alert(res.message);
//       }
//     });
//   }
  
  
// }
