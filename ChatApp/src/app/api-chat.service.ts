import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiChatService {
  hostName = window.location.hostname;
  url = 'http://'+this.hostName+':3000/';
  constructor(private _http:HttpClient) { }

  getToken(){
    return this._http.get(this.url+'get-id');
  }
  setChat(token:string, password:string){
    return this._http.post(this.url+'crete-chat', {password: password, token:token})
  }

  authanticate(token:string, password:string){
    return this._http.post(this.url+'authanticate', {password: password, token:token});
  }
}
