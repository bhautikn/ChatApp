import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ChattingSoketService } from './services/chatting-soket.service';
import { Store } from '@ngrx/store';
import { getAllChats } from './reducer/chat.selector';
import { appendData, commit } from './reducer/chat.action';
// import { fader } from './route-animations';
// import { appendData, resetChatData, setChatName } from './reducer/chat.action';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  // animations: [fader]
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

    window.onunload = (e) => {
      this._chat.disconnect();
      this.store.dispatch(commit());
    }

    this.store.select(getAllChats).subscribe((data) => {
      this.chats = data.chat;
    })
    this.joinAllChat(this.chats);

    this._chat.onReceive((data: any, callback:any)=>{
      // console.log(data);
      callback({ id: data.id, status: 'seen' });
      this.dropWater.play();
      this.addFrom(data.massage, data.dataType, data.to)
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


  addFrom(data: any, dataType: string, token: any) {

    let obj: any = {
      type: dataType,
      time: new Date().toString(),
      sended_or_recived: 'from',
    }
    switch (dataType) {
      case 'string':

        obj.data = data;
        break;

      case 'gif':
        obj.data = data;
        break;

      case 'image':
        let blob = new Blob([data])
        let myFile: File = new File([blob], "file.jpg")
        let src: any = URL.createObjectURL(myFile);
        obj.data = src;
        break;

      case 'video':
        let blobVideo = new Blob([data])
        let myFileVideo: File = new File([blobVideo], "file.mp4")
        let srcVideo: any = URL.createObjectURL(myFileVideo);
        obj.data = srcVideo;
        break;
    }

    this.setData(token, obj);
  }
  setData(token: any, obj: any) {
    this.store.dispatch(appendData({ token: token, data: obj }));
  }
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}