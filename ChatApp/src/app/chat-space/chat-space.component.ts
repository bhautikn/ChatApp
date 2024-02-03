import { Component, OnInit } from '@angular/core';
import { ChattingSoketService } from '../chatting-soket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiChatService } from '../api-chat.service';
import Swal from 'sweetalert2';

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
  ) { }

  urlToken: any = this._route.snapshot.params['token'];
  chatOption: boolean = false;
  isOpenMenu = true;
  online: boolean = false;
  gifMenu: boolean = false;
  authToken: any = '';
  name = 'Your Freind';
  status: any = 'offline';
  statusColor = 'grey';
  data: any = '';
  dataType = 'string';
  dropWater: any = new Audio('../assets/sounds/water_drop.mp3');
  incomingRing: any = new Audio('../assets/sounds/phone-incoming.mp3');
  chats: any = [];
  gifs: any = {};

  isVideoCall: boolean = false;

  ngOnInit() {
    if (screen.width < 700) {
      this.isOpenMenu = false;
    }

    this.authToken = localStorage[this.urlToken];
    if (this.authToken == '' || !this.authToken) {

      //set for login screen
      const password: any = prompt("Enter Password");
      this.authanticate(this.urlToken, password);
    }
    this._chat.join(this.authToken)

    //set status
    setTimeout(() => {
      this.chats = this.getChats();
    }, 200)
    this._chat.status().subscribe((data: any) => {
      this.status = data;
    })

    this._chat.onReceive().subscribe(({ massage, dataType }: any) => {
      this.addFrom(massage, dataType);
      this.dropWater.play();
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
          // this.redirect('/chat/video/send/' + this.urlToken)
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
    let time: any = this.formatAMPM(new Date());
    
    if (text == "\n" || text == '' || !text || text.trim() == '') return;
    textArea.value = "";

    let child = this.genrateData('text', 'to', text);
    this.setData(child);
    this._chat.send(text, this.dataType, this.authToken);
    this._chat.sendStatus('online', this.authToken);

  }
  addFrom(text: any, dataType: string) {
    var child = '';

    switch (dataType) {
      case 'string':
        child = this.genrateData('text', 'from', text);
        break;

      case 'gif':
        child = this.genrateData('image', 'from', text);
        break;

      case 'image':
        let blob = new Blob([text])
        let myFile: File = new File([blob], "file.jpg")
        let src: any = URL.createObjectURL(myFile);
        child = this.genrateData('image', 'from', src);
        break;

      case 'video':
        let blobVideo = new Blob([text])
        let myFileVideo: File = new File([blobVideo], "file.mp4")
        let srcVideo: any = URL.createObjectURL(myFileVideo);
        child = this.genrateData('video', 'from', srcVideo);
        break;

    }
    this.setData(child);
  }

  formatAMPM(date: Date) {
    var hours: any = date.getHours();
    var minutes: any = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  authanticate(token: any, password: any) {
    this._api.authanticate(token, password).subscribe((data: any) => {
      if (data.login == false) {
        password = prompt("Wrong password try again");
        this.authanticate(token, password);
      } else {
        let obj = { token: token, cretaed: this.formatAMPM(new Date()), name: '' }
        this.setChat(obj);
        localStorage.setItem(token, data.id);
        return;
      }
    })
  }

  getChats() {
    if (!localStorage['chats']) {
      let arr: any = [];
      localStorage['chats'] = JSON.stringify(arr);
    }
    return JSON.parse(localStorage['chats']);
  }

  setChat(newChat: any) {
    let chats = this.getChats()
    chats.push(newChat);

    localStorage.setItem('chats', JSON.stringify(chats));
  }

  deleteChat() {
    let isDelete = confirm("are you sure??")
    if (isDelete) {
      this._api.deleteChat(this.urlToken, this.authToken).subscribe((data: any) => {
        if (data.ok == 200) {
          // localStorage.clear();
          // let chats = this.getChats();
          //todo: make clear one chat from array of object
          localStorage.removeItem(this.urlToken)
          localStorage.removeItem('chats');
          // for (let i in chats){
          //   if(chats[i].token == this.urlToken){
          //     chats.splice(i, 1);
          //     localStorage.setItem('chats', JSON.stringify(chats));
          //     break;
          //   }
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
      child = this.genrateData('image', 'to', src);
    }
    else if (file.type.split('/')[0] == 'video') {
      this._chat.send(file, 'video', this.authToken);
      let src: any = URL.createObjectURL(file);
      child = this.genrateData('video', 'to', src);
    }
    else {
      this._chat.send(file, file.miamitype, this.authToken);
      child = this.genrateData('other', 'to', null);
    }
    this.setData(child);
  }

  setData(child: any) {
    this.dropWater.play();
    this.data += child;
    setTimeout(() => {
      const container: any = document.querySelector('.chats-container');
      container.scrollTop = container.scrollHeight;
    }, 50);
  }

  genrateData(miamitype: string, fromOrTo: string, data: any): string {

    let forVideo = `
      <video width="320" height="240" class="text" controls>
        <source src='${data}' type="video/mp4" >
      </video> <br>
    `;
    let forImage = `
      <img src='${data}' class="text"> <br>
    `;
    let forText = `
      <div class="text">${data}</div>
    `;
    let forOther = `
      <div></div>
    `
    switch (miamitype) {
      case 'text':
        return this.getStrBydata(forText, fromOrTo);
      case 'image':
        return this.getStrBydata(forImage, fromOrTo);
      case 'video':
        return this.getStrBydata(forVideo, fromOrTo);
      default:
        return ''
    }
  }
  getStrBydata(data: string, fromOrTo: string) {
    let child = `
      <div class="row">
          <div class="${fromOrTo}">
              <div class="massage">
                ${data}
                <div class="time">${this.formatAMPM(new Date())}</div>
              </div>
          </div>
      </div>
    `;
    return child;
  }

  sendGif(data: any) {
    this.gifMenu = false;
    let child = this.genrateData('image', 'to', data);
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
          // this.redirect('/chat/video/send/' + this.urlToken) 
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
  
}