import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ChattingSoketService } from './services/chatting-soket.service';
import { Store } from '@ngrx/store';
import { getAllChats } from './reducer/chat.selector';
import { appendData, commit, deletePerticulerChat, updateData } from './reducer/chat.action';

declare var ss: any;
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
  theme: any = localStorage.getItem('theme');
  async ngOnInit() {
    console.log(this.theme)
    if (!this.theme) {
      localStorage.setItem('theme', 'dark');
    }
    if(this.theme == 'light'){
      this.toggleThemeLight();
    }
    window.onunload = (e) => {
      this._chat.disconnect();
      this.store.dispatch(commit());
    }

    this.store.select(getAllChats).subscribe((data) => {
      this.chats = data.chat;
    })

    this.joinAllChat(this.chats);

    this._chat.onReceive((data: any, to:any,  callback: any) => {
      console.log(data);
      callback({ id: data.id, status: 'seen' });
      this.dropWater.play();
      this.addFrom(data, data.data, to);
    })

    this._chat.onDeleteForEveryOne((data: any, callback: any) => {
      this.store.dispatch(deletePerticulerChat({ token: data.to, id: data.id }))
      callback({ id: data.id, status: 'deleted' })
    })

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
  // preAdd({ id, dataType, token }: any) {
  //   let obj: any = {
  //     id: id,
  //     data: '',
  //     type: dataType,
  //     time: new Date().toString(),
  //     sended_or_recived: 'from',
  //   }
  //   this.setData(token, obj);
  // }
  async addFrom(obj: any, blob: any, to:any) {
    // let obj: any = {
    //   id: id,
    //   type: dataType,
    // }
    obj = {
      ...obj,
      time: new Date().toString(),
      sended_or_recived: 'from',
    }

    let lastMassage = `friend: sended ${blob}`;

    // this.setData(token, obj, lastMassage);
    // this.setData(token, obj);
    // let obj: any = {
    //   type: type
    // };
    // let lastMassage = `friend: sended ${type}`;

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

  toggleThemeLight() {
    localStorage.setItem('theme', 'light')
    this.theme = 'light';
    document.body.setAttribute('data-bs-theme', 'light');
    let lightObj: any = {
      '--background-green': 'rgba(31, 58, 32, 0.3)',
      '--background': '#f6f6f6',
      '--background-light-3': '#cfe8ff',
      '--background-light-4': '#c0e1ff',
      '--background-light': '#c9c9c9',
      '--background-light-2': '#ffe1e1',
      '--text': 'rgb(0, 0, 0)',
      '--text-light': 'rgb(62, 62, 62)',
      '--shadow': 'black',
      '--shadow-light': 'rgb(23, 23, 23)',
      '--green-dark': '#00917b',
      '--blue-dark': '#738096',
      '--blue-light': '#a7ceff',
      '--green': 'rgb(0, 255, 0)',
      '--to': 'rgb(81, 195, 132)',
      '--from': 'rgb(27, 50, 118)',
      '--from-dark': 'rgb(14, 14, 135)',
      '--tansparent-black': 'rgba(0, 0, 0, 0.3)',
      '--grid-color': 'rgb(237, 228, 228)',
      '--massage-border': 'black',
    };
    for (let key in lightObj) {
      document.documentElement.style.setProperty(key, lightObj[key]);
    }

  }
  toggleThemeDark() {
    localStorage.setItem('theme', 'dark');
    this.theme = 'dark';
    document.body.setAttribute('data-bs-theme', 'dark');
    let darkObj: any = {
      '--background-green': 'rgba(31, 58, 32, 0.3)',
      '--background': '#101820',
      '--background-light-3': '#192632',
      '--background-light-4': '#1f2d3a',
      '--background-light': '#333333',
      '--background-light-2': '#444444',
      '--text': 'white',
      '--text-light': 'grey',
      '--shadow': 'black',
      '--shadow-light': 'rgb(23, 23, 23)',
      '--green-dark': '#0c342e',
      '--blue-dark': '#39465B',
      '--blue-light': '#617fa3',
      '--green': 'rgb(0, 255, 0)',
      '--to': 'rgb(25, 89, 54)',
      '--from': 'rgb(27, 50, 118)',
      '--from-dark': 'rgb(14, 14, 135)',
      '--tansparent-black': 'rgba(0, 0, 0, 0.3)',
      '--grid-color': 'rgb(30, 30, 40)',
      '--massage-border': 'grey'
    }
    for (let key in darkObj) {
      document.documentElement.style.setProperty(key, darkObj[key]);
    }
  }
  toggleTheme() {
    if (this.theme == 'dark') {
      this.toggleThemeLight();
    }
    else {
      this.toggleThemeDark();
    }
  }

  // setData(token: any, obj: any, lastMassage: any = 'freind: sended massage') {
  //   this.store.dispatch(appendData({ token: token, data: obj, lastMassage: lastMassage }));
  // }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}