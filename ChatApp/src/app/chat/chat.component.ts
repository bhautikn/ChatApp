import { Component } from '@angular/core';
import { ApiChatService } from '../services/api-chat.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { addChat } from '../reducer/chat.action';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

  constructor(private _api: ApiChatService, private _navigate: Router, private store: Store) { }
  linkUrl: string = '';
  fullUrl: string = ''
  token = '';
  showClip = true;
  password: string = '';
  chats: any = [];
  sucsessCreated: boolean = false;
  FailHappen: boolean = false;
  chatTitle: string = '';
  createChatLoading: boolean = false;
  sendEmailLoading: boolean = false;
  // optional
  email: string = '';
  comment: string = '';

  copyToClipBord() {
    navigator.clipboard.writeText(this.fullUrl);
    this.showClip = false;
    setTimeout(() => { this.showClip = true }, 1000);
  }
  createChat() {
    this.createChatLoading = true;
    this._api.setChat(this.token, this.password).subscribe((data: any) => {
      if (data.status == 200) {
        this.createChatLoading = false;
        this.sucsessCreated = true;
        let obj = {
          token: data.token,
          cretaed: new Date().toString(),
          name: this.chatTitle,
          data: [],
          unread: 0,
        }

        this.store.dispatch(addChat({ chatObj: obj }))

        this.linkUrl = 'chat/' + data.token;
        this.fullUrl = window.location + this.linkUrl;
      } else {
        this.FailHappen = true;
      }
    })
  }
  redirect(to: string) {
    this._navigate.navigate([to]);
  }

  inviteFreind() {
    if (this.email == '' || this.comment == '') {
      return alert('Please fill the email and comment');
    }
    this.sendEmailLoading = true;
    this._api.sendEmail(this.email, this.comment, this.fullUrl).subscribe((data: any) => {
      if (data.status == 200) {
        this.sendEmailLoading = false;
        Swal.fire({
          title: 'Email sent',
          text: 'The email has been sent successfully',
          icon: 'success',
          customClass: 'swal-background',
          confirmButtonText: 'OK'
        })
      } else {
        alert('Email not sent');
      }
    });
  }
}
