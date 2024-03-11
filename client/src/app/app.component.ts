import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ChattingSoketService } from './services/chatting-soket.service';
import { Store } from '@ngrx/store';
import { getAllChats } from './reducer/chat.selector';
import { appendData, commit, deletePerticulerChat, updateData } from './reducer/chat.action';
import { ApiChatService } from './services/api-chat.service';
import { fader } from './route-animations';
import { toggleThemeLight } from './themeProvider';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [fader]
})
export class AppComponent {

  constructor(
    private _navigate: Router,
    private _chat: ChattingSoketService,
    private store: Store<any>,
    private _apichat: ApiChatService
  ) { }

  title = 'ChatApp';
  chats: any;
  dropWater: any = new Audio('../assets/sounds/water_drop.mp3');
  async ngOnInit() {
    this._apichat.dummyReq();


    //theme
    let theme: any = localStorage.getItem('theme');
    if (!theme) {
      localStorage.setItem('theme', 'dark');
    }
    if (theme == 'light') {
      toggleThemeLight();
    }
    if(!localStorage.getItem('sound')){
      localStorage.setItem('sound', 'true');
    }

    //save data on close
    window.onunload = (e) => {
      this._chat.disconnect();
      this.store.dispatch(commit());
    }

    //select all data from store
    this.store.select(getAllChats).subscribe((data) => {
      this.chats = data.chat;
    })

    //join all previusly saved chat
    this.joinAllChat(this.chats);

    //handle all chat reviving data request
    this._chat.onReceive((data: any, to: any, callback: any) => {
      callback({ id: data.id, status: 'seen' });
      this.dropWater.play();
      this.addFrom(data, data.data, to);
    })

    //handle all chat delete data request
    this._chat.onDeleteForEveryOne((data: any, callback: any) => {
      this.store.dispatch(deletePerticulerChat({ token: data.to, id: data.id }))
      callback({ id: data.id, status: 'deleted' })
    })

    //habdle all chat edit data request
    this._chat.onEdit((data: any, to: any, callback: any) => {
      callback({ id: data.id, status: 'seen' });
      this.store.dispatch(updateData({ token: to, id: data.id, data: data }));
    });

    // this._chat.onFileRecive((data: any) => {
    //   this.dropWater.play();
    //   this.preAdd(data);

    // },(data:any)=>{
    //   this.store.dispatch(setProgress({token:data.token, id:data.id, progress:10}))
    // } ,async (data: any, blob: any) => {

    //   // console.log('data', data)
    //   this.addFrom(data, blob);
    //   // console.log('blob', await blob.text())
    // })
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

  async addFrom(obj: any, blob: any, to: any) {
    obj = {
      ...obj,
      time: new Date().toString(),
      sended_or_recived: 'from',
    }

    let lastMassage = `friend: sended ${blob}`;

    switch (obj.type) {
      case 'string':
        obj.data = blob;
        lastMassage = `friend: ${obj.data}`
        break;

      case 'gif':
        obj.data = blob;
        break;

      case 'image':
        let myFile: File = new File([blob], "file.png")
        let src: any = URL.createObjectURL(myFile);
        obj.data = src;
        break;

      case 'video':
        // let blobVideo = new Blob([data])
        let myFileVideo: File = new File([blob], "file.mp4")
        let srcVideo: any = URL.createObjectURL(myFileVideo);
        obj.data = srcVideo;
        break;

      default:
        let file: File = new File([blob], "file")
        let srcFile: any = URL.createObjectURL(file);
        obj.data = srcFile;
    }
    this.store.dispatch(appendData({ token: to, data: obj, lastMassage: lastMassage }));

  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}