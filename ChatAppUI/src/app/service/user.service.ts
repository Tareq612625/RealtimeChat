import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly BaseURI = 'https://localhost:7234/api';

  constructor(private http: HttpClient) { }

  loginUser(loginObj: any) {
    return this.http.post(`${this.BaseURI}/UserInfo/Login`, loginObj);
  }

  createUser(RegnObj: any) {
    return this.http.post(`${this.BaseURI}/UserInfo/CreateUser`, RegnObj);
  }
  getAllUsers() {
    return this.http.get(`${this.BaseURI}/UserInfo/GetAllUser`);
    
  }
}
