import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import {  Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { environment } from '../../environments/environment';

import {MessageService} from '../../service/message.service'
import {UserService} from '../../service/user.service'
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  title = 'ChatAppClient';
  private connection: HubConnection;
  public messages: string[] = [];
  public user: string = "";
  public message: string = "";
  readonly ChatHubURI = environment.chatHubUrl

  constructor(private http: HttpClient) {
    this.connection = new HubConnectionBuilder()
      .withUrl(this.ChatHubURI)
      .build();
  }

  async ngOnInit() {
    this.connection.on('ReceiveMessage', (user, message) => {
      this.messages.push(`${user}: ${message}`);
    });

    try {
      await this.connection.start();
      console.log('Connected to SignalR hub');
    } catch (error) {
      console.error('Failed to connect to SignalR hub', error);
    }
  }

  async sendMessage() {
    if (!this.user || !this.message) return;
    await this.connection.invoke('SendSimpleMessage', this.user, this.message);
    this.message = '';
  }
}