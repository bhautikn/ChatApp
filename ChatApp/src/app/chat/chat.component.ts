import { Component } from '@angular/core';
import { ApiChatService } from '../api-chat.service';
import { Router } from '@angular/router';

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

  sucsessCreated: boolean = false;
  FailHappen: boolean = false;

  // genrateToken() {
  //   // this.getTokenLoading = true;
  //   this._api.getToken().subscribe((res: any) => {
  //     this.token = res.token;
  //     // this.getTokenLoading = false;
  //   })
  // }

  copyToClipBord() {
    navigator.clipboard.writeText(this.fullUrl);
    this.showClip = false;
    setTimeout(() => { this.showClip = true }, 1000);
  }
  createChat() {
    this._api.setChat(this.token, this.password).subscribe((data: any) => {
      if (data.status == 200) {
        this.sucsessCreated = true;
        this.linkUrl = 'chat/' + data.token;
        this.fullUrl = window.location + this.linkUrl;
      } else {
        this.FailHappen = true;
      }
    })
  }

}
