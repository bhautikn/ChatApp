import { Component } from '@angular/core';
import { ApiChatService } from '../services/api-chat.service';
import { Router } from '@angular/router';
import { formatAMPM, setChat } from '../../environments/environment.development';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

  constructor(private _api: ApiChatService, private _navigate: Router) { }
  linkUrl: string = '';
  fullUrl: string = ''
  token = '';
  showClip = true;
  password: string = '';
  chats:any = [];
  sucsessCreated: boolean = false;
  FailHappen: boolean = false;
  chatTitle: string = '';

  ngOnInit(){
    this.chats = this.getChats();
  }

  copyToClipBord() {
    navigator.clipboard.writeText(this.fullUrl);
    this.showClip = false;
    setTimeout(() => { this.showClip = true }, 1000);
  }
  createChat() {
    this._api.setChat(this.token, this.password).subscribe((data: any) => {
      if (data.status == 200) {
        this.sucsessCreated = true;

        let obj = { token: data.token, cretaed: formatAMPM(new Date()), name: this.chatTitle }
        setChat(obj);

        this.linkUrl = 'chat/' + data.token;
        this.fullUrl = window.location + this.linkUrl;
      } else {
        this.FailHappen = true;
      }
    })
  }
  redirect(to:string){
    this._navigate.navigate([to]);
  }
  getChats(){
    if(!localStorage['chats']){
      let arr:any = [];
      localStorage['chats'] = JSON.stringify(arr);
    }
    return JSON.parse(localStorage['chats']);
  }
}
