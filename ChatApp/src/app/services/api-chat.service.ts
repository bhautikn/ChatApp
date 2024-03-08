import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ApiChatService {
  url = environment.apiUrl+'chat/';
  constructor(private _http: HttpClient) { }

  setChat(token: string, password: string) {
    return this._http.post(this.url, { password: password, token: token })
  }
  deleteChat(chatId: any, token: any) {
    return this._http.delete(this.url + chatId, { headers: { token: token } })
  }
  authanticate(token: string, password: string) {
    return this._http.post(this.url + 'authanticate', { password: password, token: token });
  }
  sendEmail(email: string, comment: string, url: string) {
    return this._http.post(this.url+'email', { email: email, comment: comment, chat_link: url });
  }
  dummyReq(){
    this._http.get(this.url).subscribe();
  }
}
