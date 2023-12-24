import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiChatService {
  url = 'http://localhost:3000/';
  constructor(private _http:HttpClient) { }

  getToken(){
    return this._http.get(this.url+'get-id');
  }

  setChat(token:string, password:string){
    return this._http.post(this.url+'crete-chat', {password: password, token:token})
  }
}
