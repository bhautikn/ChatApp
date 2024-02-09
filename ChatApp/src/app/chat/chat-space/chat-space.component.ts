import { Component, OnInit } from '@angular/core';
import { ChattingSoketService } from '../../services/chatting-soket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiChatService } from '../../services/api-chat.service';
import Swal from 'sweetalert2';
import { formatAMPM, getToday, tost } from '../../../environments/environment.development'
import { Store } from '@ngrx/store';
import { getAllChats } from '../../reducer/chat.selector';
import { addChat, appendData, deleteChat, resetChatData } from '../../reducer/chat.action';
import { genrateData } from '../../functions';
import { animation } from '@angular/animations';


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
  chats: any = [];
  curruntIndex: number = -1;
  isVideoCall: boolean = false;
  chatTitle: string = ''
  formatAMPM = formatAMPM;
  
  async ngOnInit() {

    this.store.select(getAllChats).subscribe((data: any) => {
      this.chats = data.chat;
      console.log(this.chats)
      if (this.curruntIndex == -1) {
        this.curruntIndex = this.chats.map((e: any) => e.token).indexOf(this.urlToken);
        if (this.curruntIndex >= 0) {
          if (this.chats[this.curruntIndex].data) {
            this.data = this.chats[this.curruntIndex].data;
          } else {
            this.data = []
          }
        }
      }
      else {
        if (this.curruntIndex >= 0) {
          if (this.chats[this.curruntIndex].data) {
            this.data = this.chats[this.curruntIndex].data;
          } else {
            this.data = []
          }
        }
      }
      setTimeout(() => {
        this.scrollTop();
      }, 10)
      // this.store.dispatch(resetresetUnreadToZero({token: this.urlToken}));
    })
    if (screen.width < 700) {
      this.isOpenMenu = false;
    }

    this.authToken = localStorage[this.urlToken];

    if (this.authToken == '' || !this.authToken) {

      //set for login screen
      const password: any = await this.passwordEnterPopUp();
      await this.authanticate(this.urlToken, password);
    }
    this.name = this.chats[this.curruntIndex].name;
    //set status
    this._chat.status().subscribe((data: any) => {
      this.status = data;
    })

    this._chat.onCancleVideoCall().subscribe(() => {
      console.log('cancling call');
      Swal.close();
    })
    this._chat.onReqVideoCall().subscribe((func: any) => {
      const incomingRing: any = new Audio('../assets/sounds/phone-incoming.mp3');
      incomingRing.play()
      // this.incomingRing.loop=true;

      Swal.fire({
        title: "Incomming Video Call",
        iconHtml: "<i class='bi bi-telephone-inbound'></i>",
        timer: 10000,
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
          incomingRing.pause()
          this.isVideoCall = true;
        } else if (!result.isConfirmed) {
          func(false)
          incomingRing.pause()
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
    // let time: any = formatAMPM(new Date());

    if (text == "\n" || text == '' || !text || text.trim() == '') return;
    textArea.value = "";

    const obj = {
      type: 'string',
      text: text,
      time: new Date().toString(),
      sended_or_recived: 'to',
    }
    this.store.dispatch(appendData({ token: this.urlToken, data: obj }));
    let child = genrateData('text', 'to', text);
    // this.setData(child);
    this._chat.send(text, this.dataType, this.authToken, (data: any) => {
      console.log(data)
    });
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
          let name: string = await this.nameEnterPopUp();
          let today = getToday();

          let obj = {
            token: this.urlToken,
            cretaed: today,
            name: name,
            data: [],
            unread: 0,
          }
          this.store.dispatch(addChat({ chatObj: obj }));
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
          this.store.dispatch(deleteChat({ index: this.curruntIndex }))
          this._navigate.navigate(['/']);
        }
      });
    }
  }

  redirect(to: string) {
    this.data = [];
    this._navigate.navigate([to]);
  }

  uploadFile(e: any) {
    let file = e.target.files[0];

    let obj:any = {
      time: new Date().toString(),
      sended_or_recived: 'to',
    }

    // let child = '';
    if (file.type.split('/')[0] == 'image') {
      this._chat.send(e.target.files[0], 'image', this.authToken, (data: any) => {
        console.log(data)
      });
      let src: any = URL.createObjectURL(file);

      obj.type = 'image';
      obj.src = src;
      // child = genrateData('image', 'to', src);
    }
    else if (file.type.split('/')[0] == 'video') {
      this._chat.send(file, 'video', this.authToken, (data: any) => {
        console.log(data)
      });
      let src: any = URL.createObjectURL(file);
      obj.type = 'video';
      obj.src = src;
      // child = genrateData('video', 'to', src);
    }
    else {
      this._chat.send(file, file.miamitype, this.authToken, (data: any) => {
        console.log(data)
      });
      obj.type = 'other';
      obj.data = null;
      // child = genrateData('other', 'to', null);
    }
    this.setData(obj);
  }

  setData(obj: any) {
    if (this.status == 'offline') {
      tost({ title: 'Your Freind is offline', icon: 'warning' }, true);
    }
    this.dropWater.play();
    // this.data += child;
    this.store.dispatch(appendData({ token: this.urlToken, data: obj }))
    setTimeout(() => {
      this.scrollTop()
    }, 50);
  }



  sendGif(data: any) {
    const obj = {
      type: 'gif',
      text: '',
      url: data,
      time: new Date().toString(),
      sended_or_recived: 'to',
    }
    this.gifMenu = false;
    this.store.dispatch(appendData({ token: this.urlToken, data: obj }));
    // let child = genrateData('image', 'to', data);
    // this.setData(child)
    this._chat.sendStatus('online', this.authToken);
    this._chat.send(data, 'gif', this.authToken, (data: any) => {
      console.log(data)
    });
  }

  videoCall() {

    function clearAllThings() {
      clearInterval(MusicPlayId)
      phoneCallMusic.pause();
      Swal.close()
    }

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
        this._chat.cancleVideoCall(this.authToken);
        // tost({ title: 'User is busy', icon: 'info' });
      }
    }).then((result: any) => {
      if (!result.isConfirmed) {
        clearAllThings();
        this._chat.cancleVideoCall(this.authToken);
      }
    })
    this._chat.reqVideoCall(this.authToken, (data: any) => {

      if(data == false){
        clearAllThings();
        tost({ title: 'User is busy', icon: 'info' })
      }
      if (data == true) {
        clearAllThings();
        this.isVideoCall = true;
      }
    })
  }

  handleVideoCallCutEvent(event: any) {
    console.log(event)
    this.isVideoCall = false;
  }

  clearChat() {
    // this.data = [];
    this.store.dispatch(resetChatData({ token: this.urlToken }))
    // this.setChatData(this.urlToken, '');
  }
  goBack() {
    // this.setChatData(this.urlToken, this.data);
    this.redirect('/');
  }
  reloadPage(url: any) {
    this.curruntIndex = -1;
    this.urlToken = url.split('/')[2];
    setTimeout(() => {
      this.ngOnInit();
    }, 50);
  }

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
  async nameEnterPopUp() {
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