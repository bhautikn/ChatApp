import { Component, OnInit } from '@angular/core';
import { ChattingSoketService } from '../../services/chatting-soket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiChatService } from '../../services/api-chat.service';
import Swal from 'sweetalert2';
import { deleteChat, formatAMPM, getChats, getToday, setChat, tost, updateChat } from '../../../environments/environment.development'
import { Store } from '@ngrx/store';
import { getAllChats, getChatByToken } from '../../reducer/chat.selector';
import { addChat, appendData, resetChatData, resetresetUnreadToZero } from '../../reducer/chat.action';
import { genrateData } from '../../functions';

@Component({
  selector: 'app-chat-space',
  templateUrl: './chat-space.component.html',
  styleUrl: './chat-space.component.css'
})
export class ChatSpaceComponent implements OnInit {

  constructor(
    private _chat: ChattingSoketService,
    private _route: ActivatedRoute,
    private _api: ApiChatService,
    private _navigate: Router,
    private store: Store
  ) { }

  urlToken: any = this._route.snapshot.params['token'];
  chatOption: boolean = false;
  isOpenMenu = true;
  gifMenu: boolean = false;
  authToken: any = '';
  name = 'Your Freind';
  status: any = 'offline';
  statusColor = 'grey';
  data: any;
  dataType = 'string';
  dropWater: any = new Audio('../assets/sounds/water_drop.mp3');
  incomingRing: any = new Audio('../assets/sounds/phone-incoming.mp3');
  chats: any = [];
  curruntIndex:number = -1;
  isVideoCall: boolean = false;
  chatTitle: string = ''

  async ngOnInit() {
    
    this.store.select(getAllChats).subscribe((data: any)=>{
      console.log('Hello');
      this.chats = data.chat;
      if(this.curruntIndex == -1){
        this.curruntIndex  = this.chats.map((e:any) => e.token).indexOf(this.urlToken);
        if(this.curruntIndex >= 0 ){
          if(this.chats[this.curruntIndex].data){
            this.data = this.chats[this.curruntIndex].data;
          }else{
            this.data = ''
          }
        }
      }
      else{
        if(this.curruntIndex >= 0 ){
          if(this.chats[this.curruntIndex].data){
            this.data = this.chats[this.curruntIndex].data;
          }else{
            this.data = ''
          }
        }
      }
      setTimeout(() => {
        this.scrollTop();
      }, 200)
      // if(this.curruntIndex >= 0){

      // }
    })

    // this.store.select(getChatByToken({token: this.urlToken})).subscribe((data:any)=>{
    //   if(data){
    //     this.data = data.data
    //     this.scrollTop();

    //     setTimeout(() => {
    //       this.scrollTop();
    //     }, 200)
    //     // this.store.dispatch(resetresetUnreadToZero({token: this.urlToken}));
    //   }
    //   else{
    //     this.data = '';
    //   }
    // })
    if (screen.width < 700) {
      this.isOpenMenu = false;
    }

    this.authToken = localStorage[this.urlToken];

    if (this.authToken == '' || !this.authToken) {

      //set for login screen
      const password: any = await this.passwordEnterPopUp();
      await this.authanticate(this.urlToken, password);
    }

    //set status

    this._chat.status().subscribe((data: any) => {
      this.status = data;
    })

    this._chat.onReqVideoCall().subscribe((func: any) => {
      this.incomingRing.play()
      // this.incomingRing.loop=true;

      Swal.fire({
        title: "Incomming Video Call",
        iconHtml: "<i class='bi bi-telephone-inbound'></i>",
        timer: 1000,
        customClass: 'swal-background',
        showClass: {
          popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `
        },
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Answer"
      }).then((result) => {
        if (result.isConfirmed) {

          func(true);
          this.incomingRing.pause()
          this.isVideoCall = true;

        } else if (!result.isConfirmed) {

          func(false)
          this.incomingRing.pause()

        }
      });
    });
  }

  input(e: any) {
    this._chat.sendStatus('typing', this.authToken)
    if (e.keyCode == 13) {
      this.addTo();
      return;
    }

    { // block for auto height
      // e.target.style.height = 0;
      // let max = 100;
      // let height = e.target.scrollHeight;
      // if (height < max) {
      //   e.target.style.height = (e.target.scrollHeight) + "px";
      // } else {
      //   e.target.style.height = (100) + "px";
      // }
    }

  }
  addTo() {
    const textArea: any = document.querySelector('#textarea');
    let text: string = textArea.value;
    textArea.style.height = '0px';
    let time: any = formatAMPM(new Date());

    if (text == "\n" || text == '' || !text || text.trim() == '') return;
    textArea.value = "";

    let child = genrateData('text', 'to', text);
    this.setData(child);
    this._chat.send(text, this.dataType, this.authToken);
    this._chat.sendStatus('online', this.authToken);

  }

  async authanticate(token: any, password: any) {
    await this._api.authanticate(token, password).subscribe(async (data: any) => {
      if (data.login == false) {
        password = await this.passwordEnterPopUp();
        this.authanticate(token, password);
      } else {
        localStorage.setItem(token, data.id);
        let isFound: boolean = false;
        this.chats.forEach((element: any) => {
          if (element.token == this.urlToken) {
            isFound = true;
            return;
          }
        });
        if (!isFound) {
          let name:string = await this.nameEnterPopUp();
          let today = getToday();

          let obj = {
            token: this.urlToken,
            cretaed: today,
            name: name,
            data: '',
            unread: 0,
          }
          this.store.dispatch(addChat({chatObj: obj}));
        }
        return;
      }
    })
  }
  joinChat() {
    this._chat.join(this.authToken)
  }


  deleteChat() {
    let isDelete = confirm("are you sure??")
    if (isDelete) {
      this._api.deleteChat(this.urlToken, this.authToken).subscribe((data: any) => {

        if (data.ok == 200) {
          const { length,firstToken } = deleteChat(this.urlToken)
          // if (length != 0) {
          //   this._navigate.navigate(['/chat/' + firstToken]);
          // }
          // else {
          // this._navigate.navigate(['/']);
          // }
          this._navigate.navigate(['/']);
        }
      });
    }
  }


  redirect(to: string) {
    this.data = '';
    this._navigate.navigate([to]);
  }

  uploadFile(e: any) {
    let file = e.target.files[0];
    let child = '';
    if (file.type.split('/')[0] == 'image') {
      this._chat.send(e.target.files[0], 'image', this.authToken);
      let src: any = URL.createObjectURL(file);
      child = genrateData('image', 'to', src);
    }
    else if (file.type.split('/')[0] == 'video') {
      this._chat.send(file, 'video', this.authToken);
      let src: any = URL.createObjectURL(file);
      child = genrateData('video', 'to', src);
    }
    else {
      this._chat.send(file, file.miamitype, this.authToken);
      child = genrateData('other', 'to', null);
    }
    this.setData(child);
  }

  setData(child: any) {
    if (this.status == 'offline') {
      tost({ title: 'Your Freind is offline', icon: 'warning' });
    }
    this.dropWater.play();
    // this.data += child;
    this.store.dispatch(appendData({token: this.urlToken, data: child}))
    setTimeout(() => {
      this.scrollTop()
    }, 50);
  }

  

  sendGif(data: any) {
    this.gifMenu = false;
    let child = genrateData('image', 'to', data);
    this.setData(child)
    this._chat.sendStatus('online', this.authToken);
    this._chat.send(data, 'gif', this.authToken);
  }

  videoCall() {

    function clearAllThings() {
      clearInterval(videoReq)
      clearInterval(MusicPlayId)
      clearInterval(timerInterval)
      phoneCallMusic.pause();
      Swal.close()
    }

    let timerInterval: any;
    const phoneCallMusic = new Audio('../assets/sounds/phone-outgoing.mp3')
    const MusicPlayId = setInterval(() => {
      phoneCallMusic.play();
    }, 500);
    Swal.fire({
      customClass: 'swal-background',
      position: "top-end",
      title: "Calling ...",
      iconHtml: "<i class='bi bi-telephone-outbound call-icon fs-1'></i>",
      timer: 10000,
      timerProgressBar: true,
      showCancelButton: true,
      willClose: () => {
        clearAllThings();
      }
    }).then((result: any) => {
      if (!result.isConfirmed) {
        clearAllThings();
      }
    })

    let videoReq = setInterval(() => {
      this._chat.reqVideoCall(this.authToken, (data: any) => {
        console.log(data);
        if (data != 'err') {
          clearAllThings();
        };
        if (data == true) {
          this.isVideoCall = true;
        };
      })
    }, 1000);
    setTimeout(() => {
      clearInterval(videoReq);
    }, 10 * 1000)

  }
  handleVideoCallCutEvent(event: any) {
    console.log(event)
    this.isVideoCall = false;
  }
  clearChat() {
    this.data = '';
    this.store.dispatch(resetChatData({token: this.urlToken}))
    // this.setChatData(this.urlToken, '');
  }
  goBack() {
    // this.setChatData(this.urlToken, this.data);
    this.redirect('/');
  }
  reloadPage(url: any) {
    // let oldUrl = this.urlToken;
    this.curruntIndex = -1;
    this.urlToken = url.split('/')[2];
    // this.setChatData(oldUrl, this.data);
    // this.data = this.getChatData(this.urlToken);
    // this.status = 'offline';
    // this.statusColor = 'grey';
    setTimeout(() => {
      // this._chat.connect();
      this.ngOnInit();
    }, 50);
  }

  // setChatData(urlToken: any, data: any) {
  //   let chats = getChats();
  //   for (let i in chats) {
  //     if (chats[i].token == urlToken) {
  //       chats[i].data = data;
  //       updateChat(chats);
  //       break;
  //     }
  //   }
  // }
  // getChatData(urlToken: any): any {
  //   let chats = getChats();
  //   for (let i in chats) {
  //     if (chats[i].token == urlToken) {
  //       if (!chats[i].data)
  //         return '';
  //       return chats[i].data;
  //     }
  //   }
  // }
  scrollTop() {
    const container: any = document.querySelector('.chats-container');
    container.scrollTop = container.scrollHeight;
  }

  async passwordEnterPopUp() {
    let outPassword: string = ''

    await Swal.fire({
      title: "Enter password",
      input: "password",
      customClass: 'swal-background',
      inputAttributes: {
        autocapitalize: "off"
      },
      showCancelButton: true,
      preConfirm: (password) => {
        outPassword = password;
      }
    })
    return outPassword;
  }
  async nameEnterPopUp(){
    let Outname: string = 'Anonymouse';
    await Swal.fire({
      title: 'Chat Name',
      input: "text",
      customClass: 'swal-background',
      showCancelButton: true,
      inputAttributes: {
        autocapitalize: "off"
      },
      preConfirm: (name) => {
        Outname = name;
      }
    })
    return Outname;
  }
}