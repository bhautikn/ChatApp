import { Component } from '@angular/core';
import { ApiChatService } from '../api-chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  constructor(private _api:ApiChatService, private _navigate:Router){}
  token = '';
  showClip= true;
  getTokenLoading = false;
  
  genrateToken(){
    this.getTokenLoading = true;
    this._api.getToken().subscribe((res:any)=>{
      this.token = res.token;
      this.getTokenLoading = false;
    })
  }
  copyToClipBord(value:string){
    navigator.clipboard.writeText(value);
    this.showClip = false;
    setTimeout(()=>{this.showClip = true}, 1000);
  }
  startChat(){
    this._navigate.navigate(['/chat/'+this.token]);
  }
}
