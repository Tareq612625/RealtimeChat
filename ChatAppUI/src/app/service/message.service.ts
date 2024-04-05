import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
  export class MessageService {
    readonly BaseURI = 'https://localhost:7234/api';
    constructor(private http: HttpClient){

    }
    getUserReceivedMessages(userId:string) {
        return this.http.get(this.BaseURI + '/Message');
      }

      // deleteMessage(message) {
      //   return this.http.post(this.BaseURI + '/message',message);
      // }
  }