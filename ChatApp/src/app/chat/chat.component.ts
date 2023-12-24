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
  password:string = '';

  sucsessCreated:boolean = false;
  FailHappen:boolean = false;
  loginSucsess: boolean = false;
  loginFaild: boolean = false;

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
    this._api.authanticate(this.token, this.password).subscribe((data:any)=>{
      if(data.login == false){
        this.loginFaild = true;
      }else{
        this.loginSucsess = true;
        localStorage.setItem('auth', data.id);
        this._navigate.navigate(['/chat/'+this.token]);
      }
    })
  }

  createChat(){
    this._api.setChat(this.token, this.password).subscribe((data:any)=>{
      if(data.status == 200){
        this.sucsessCreated = true;
      }else{
        this.FailHappen = true;
      }
    })
  }

}
