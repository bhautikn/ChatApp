import { Component } from '@angular/core';
import { ApiChatService } from '../services/api-chat.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { addChat } from '../reducer/chat.action';
import Swal from 'sweetalert2';
import { toggleThemeDark, toggleThemeLight } from '../themeProvider';


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
  width = screen.width;
  showClip = true;
  password: string = '';
  chats: any = [];
  sucsessCreated: boolean = false;
  FailHappen: boolean = false;
  chatTitle: string = '';
  createChatLoading: boolean = false;
  sendEmailLoading: boolean = false;
  showcreateChat: boolean = true;
  theme: any = localStorage.getItem('theme');
  // optional
  email: string = '';
  comment: string = '';

  ngOnInit() {

    //theme
    if (!this.theme) {
      localStorage.setItem('theme', 'dark');
    }
    if (this.theme == 'light') {
      toggleThemeLight();
    }

    if (screen.width < 768) {
      this.showcreateChat = false;
    }
  }

  //theme change handler
  toggleTheme() {
    if (this.theme == 'dark') {
      toggleThemeLight();
      this.theme = 'light';
    }
    else {
      toggleThemeDark();
      this.theme = 'dark';
    }
  }

  copyToClipBord() {
    navigator.clipboard.writeText(this.fullUrl);
    this.showClip = false;
    setTimeout(() => { this.showClip = true }, 1000);
  }
  createChat() {
    if (this.chatTitle == '') {
      return alert('Please fill the chat title ');
    }
    if (this.password == '') {
      return alert('Please fill the chat password');
    }
    this.createChatLoading = true;
    this._api.setChat(this.token, this.password).subscribe((data: any) => {
      this.createChatLoading = false;
      if (data.status == 200) {
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
}