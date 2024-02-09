import { Component } from '@angular/core';
import { Router } from '@angular/router';
// import { getChats } from '../environments/environment.development';
import { ChattingSoketService } from './services/chatting-soket.service';

import { Store, select } from '@ngrx/store';
// import { Observable } from 'rxjs';

// import {
//   loadChats,
//   resetChat
// } from './reducer/chat.action';
// import { selectAllChats } from './reducer/chat.selector';
// import { Chat } from './model/chat.model';
// import { RootReducerState } from './reducer';
// import { UserListReq } from './reducer/chat.action';
import { getAllChats } from './reducer/chat.selector';
import { appendData, commit } from './reducer/chat.action';
import { genrateData } from './functions';
import { Token } from '@angular/compiler';
import { Socket } from 'ngx-socket-io';
// import { appendData, resetChatData, setChatName } from './reducer/chat.action';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(
    private _navigate: Router,
    private _chat: ChattingSoketService,
    private store: Store<any>
  ) { }

  title = 'ChatApp';
  chats: any;
  dropWater: any = new Audio('../assets/sounds/water_drop.mp3');

  async ngOnInit() {

    window.onunload = (e)=>{
      this.store.dispatch(commit());
    }

    this.store.select(getAllChats).subscribe((data) => {

      this.chats = data.chat;
      this.joinAllChat(this.chats);
    })
    this._chat.onReceive().subscribe(({ massage, dataType, to }: any) => {
      this.addFrom(massage, dataType, to)
      this.dropWater.play();
    })

  }

  async joinAllChat(chats: any) {
    chats.forEach((element: any) => {
      const authToken: any = localStorage.getItem(element.token);
      if (authToken)
        this._chat.join(authToken);
    })
  }

  navigate(path: string, e: any) {
    this._navigate.navigate([path]);
    if (path == '/') {
      e.target.style.background = 'var(--green-dark)';
      let post: any = document.querySelector('#post');
      post.style.background = 'none';
    }
    else {
      e.target.style.background = 'var(--green-dark)';
      let chat: any = document.querySelector('#chat');
      chat.style.background = 'none';
    }
  }


  addFrom(text: any, dataType: string, token:any) {
    var child = '';

    switch (dataType) {
      case 'string':
        child = genrateData('text', 'from', text);
        break;

      case 'gif':
        child = genrateData('image', 'from', text);
        break;

      case 'image':
        let blob = new Blob([text])
        let myFile: File = new File([blob], "file.jpg")
        let src: any = URL.createObjectURL(myFile);
        child = genrateData('image', 'from', src);
        break;

      case 'video':
        let blobVideo = new Blob([text])
        let myFileVideo: File = new File([blobVideo], "file.mp4")
        let srcVideo: any = URL.createObjectURL(myFileVideo);
        child = genrateData('video', 'from', srcVideo);
        break;

    }
    this.setData(token, child);
  }
  setData(token: any, child: any) {
    this.store.dispatch(appendData({ token: token, data: child }));
  }
}