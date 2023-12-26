import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiChatService {
  url = environment.apiUrl;
  constructor(private _http:HttpClient) { }

  getToken(){
    return this._http.get(this.url+'get-id');
  }
  setChat(token:string, password:string){
    return this._http.post(this.url+'crete-chat', {password: password, token:token})
  }
  deleteChat(chatId:any, token:any){
    return this._http.delete(this.url+'chat/'+chatId, {headers: {token : token}})
  }
  authanticate(token:string, password:string){
    return this._http.post(this.url+'authanticate', {password: password, token:token});
  }
}
