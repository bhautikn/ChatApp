import { Component, OnInit } from '@angular/core';
import { ChattingSoketService } from '../../services/chatting-soket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiChatService } from '../../services/api-chat.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { getAllChats } from '../../reducer/chat.selector';
import { addChat, deletePerticulerChat, resetChatData } from '../../reducer/chat.action';
import { decodeHTMLEntities, deleteChatByToken, formatAMPM, sendDataToFreind, tost } from '../../functions';


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
  // chatOption: boolean = false;
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
  isAudioCall: boolean = false;
  chatLefticons: boolean = true;
  isForwarding: boolean = false;
  forwardData: any;

  //searching chats
  searchingChat: boolean = true;
  searchArray: any = [];
  searchInfo: any = {
    curruntIndex: 0,
    lenght: 0,
  };

  chatTitle: string = ''
  formatAMPM = formatAMPM;

  async ngOnInit() {
    this.store.select(getAllChats).subscribe((data: any) => {
      this.chats = data.chat;
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
            console.log(this.data);
          } else {
            this.data = []
          }
        }
      }
      setTimeout(() => {
        this.scrollTop();
      }, 10)
    })

    this.authToken = localStorage[this.urlToken];

    if (this.authToken == '' || !this.authToken) {

      //set for login screen
      const { password, isConfirmed }: any = await this.passwordEnterPopUp();
      if (isConfirmed == false) {
        this._navigate.navigate(['/']);
        return;
      }
      else {
        await this.authanticate(this.urlToken, password);
      }
    }
    this.name = this.chats[this.curruntIndex].name;
    //set status
    this._chat.status().subscribe((data: any) => {
      this.status = data;
    })

    this._chat.onCancleVideoCall().subscribe(() => {
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

    //audio call

    this._chat.onReqAudioCall().subscribe((func: any) => {
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
          this.isAudioCall = true;
        } else if (!result.isConfirmed) {
          func(false)
          incomingRing.pause()
        }
      });
    });

  }

  ngAfterViewInit() {
    var holder: any = document.querySelector('.main-container');
    const handleDragElement = (e: any) => {
      e.preventDefault();
      this.uploadFile(null, e.dataTransfer.files[0]);
    }
    holder.ondragover = function () { this.style.border = '2px dashed green'; return false; };
    holder.ondragend = function () { this.style.border = '1px solid rgb(51, 51, 51)'; return false; };
    holder.ondrop = function (e: any) {
      handleDragElement(e);
      this.style.border = '1px solid rgb(51, 51, 51)';
    }
  }

  input(e: any) {
    this.typing(true);
    // this._chat.sendStatus('typing', this.authToken)
    if (e.keyCode == 13) {
      this.addTo();
      return;
    }
    { // block for auto height
      e.target.style.height = 0;
      let max = 100;
      let height = e.target.scrollHeight;
      if (height < max) {
        e.target.style.height = (e.target.scrollHeight) + "px";
      } else {
        e.target.style.height = (100) + "px";
      }
    }
  }

  typing(isTyping: any) {
    if (isTyping && this.chatLefticons) {
      this._chat.sendStatus('typing', this.authToken);
      this.chatLefticons = false;
    }
    else if (!isTyping && !this.chatLefticons) {
      this._chat.sendStatus('online', this.authToken);
      this.chatLefticons = true;
    }
  }

  addTo() {
    const textArea: any = document.querySelector('#textarea');
    let text: string = textArea.value;

    if (text == "\n" || text == '' || !text || text.trim() == '') return;

    setTimeout(() => {
      textArea.value = "";
      textArea.style.height = '0px';
    }, 1)

    const obj = {
      type: 'string',
      data: text,
      sendableData: text
    }
    this.setData(obj);
  }

  async authanticate(token: any, password: any) {
    await this._api.authanticate(token, password).subscribe(async (data: any) => {
      if (data.login == false) {
        const { password, isConfirmed } = await this.passwordEnterPopUp('wrong password try again!!');
        if (!isConfirmed) {
          this._navigate.navigate(['/']);
          return;
        }
        else {
          this.authanticate(token, password);
        }
      } else {
        localStorage.setItem(token, data.id);
        this._chat.join(this.authToken);
        let isFound: boolean = false;
        this.chats.forEach((element: any) => {
          if (element.token == this.urlToken) {
            isFound = true;
            return;
          }
        });
        if (!isFound) {
          let name: string = await this.nameEnterPopUp();
          let obj = {
            token: this.urlToken,
            cretaed: new Date().toString(),
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

  // joinChat() {
  //   this._chat.join(this.authToken)
  // }

  async deleteChat() {

    await deleteChatByToken({
      urlToken: this.urlToken,
      authToken: this.authToken,
      api: this._api,
      store: this.store,
      curruntIndex: this.curruntIndex,
    });
    this._navigate.navigate(['/']);

  }

  redirect(to: string) {
    this.data = [];
    this._navigate.navigate([to]);
  }

  uploadFile(e: any, file: any = null) {
    file = file || e.target.files[0];

    let obj: any = {}
    if (file.type.split('/')[0] == 'image') {
      let src: any = URL.createObjectURL(file);
      obj.type = 'image';
      obj.data = src;
      obj.sendableData = file;
    }
    else if (file.type.split('/')[0] == 'video') {
      let src: any = URL.createObjectURL(file);
      obj.type = 'video';
      obj.data = src;
      obj.sendableData = file
    }
    else {
      obj.type = file.miamitype;
      obj.data = file;
      obj.sendableData = file
    }
    this.setData(obj);
  }

  setData(obj: any) {
    obj.time = new Date().toString()
    obj.sended_or_recived = 'to';
    obj.id = Date.now();
    obj.status = 'pending';

    if (this.status == 'offline') {
      tost({ title: 'Your Freind is offline', icon: 'warning' }, true);
    }
    this.dropWater.play();
    sendDataToFreind(obj, this._chat, this.authToken, this.urlToken, this.store);

    setTimeout(() => {
      this.scrollTop();
    }, 50);

    this.typing(false);
  }

  sendGif(data: any) {
    const obj = {
      type: 'gif',
      data: data,
      sendableData: data,
    }
    this.gifMenu = false;
    this.setData(obj);
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

      if (data == false) {
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
    this.isVideoCall = false;
  }

  audioCall() {
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
        this._chat.cancleAudioCall(this.authToken);
        // tost({ title: 'User is busy', icon: 'info' });
      }
    }).then((result: any) => {
      if (!result.isConfirmed) {
        clearAllThings();
        this._chat.cancleAudioCall(this.authToken);
      }
    })
    this._chat.reqAudioCall(this.authToken, (data: any) => {

      if (data == false) {
        clearAllThings();
        tost({ title: 'User is busy', icon: 'info' })
      }
      if (data == true) {
        clearAllThings();
        this.isAudioCall = true;
      }
    })
  }

  handleAudioCallCutEvent(event: any) {
    this.isAudioCall = false;
  }

  clearChat() {
    this.store.dispatch(resetChatData({ token: this.urlToken }))
  }

  goBack() {
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

  async passwordEnterPopUp(massage: string = 'Enter password') {
    let outPassword: any = { password: '', isConfirmed: false }

    await Swal.fire({
      title: massage,
      input: "password",
      customClass: 'swal-background',
      inputAttributes: {
        autocapitalize: "off"
      },
      showCancelButton: true,
      cancelButtonText: 'go back',
      preConfirm: (password) => {
        outPassword.password = password;
      }
    }).then((result) => {
      outPassword.isConfirmed = result.isConfirmed;
      outPassword.password = result.value;
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

  deletePerticulerChat(index: any) {
    this.store.dispatch(deletePerticulerChat({ index: index, token: this.urlToken }));
  }

  copyToClipBord(text: string) {
    navigator.clipboard.writeText(decodeHTMLEntities(text));
    tost({ title: 'Text Copied', icon: 'success' });
  }

  downloadFile(src: any, type: string) {
    var a: any = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    if (type == 'image') {
      var fileName = Math.random().toString(36).substring(7) + '.png';
    }
    else if (type == 'video') {
      var fileName = Math.random().toString(36).substring(7) + '.mp4';
    }
    else if (type == 'gif') {
      var fileName = Math.random().toString(36).substring(7) + '.gif';
    } else {
      var fileName = Math.random().toString(36).substring(7) + '.file';
    }
    a.href = src;
    a.download = fileName;
    a.click();
  }

  showImage(url: any) {
    Swal.fire({
      imageUrl: url,
      width: '100%',
      // imageHeight: '100vh',
      showCloseButton: true,
      background: 'transparent',
      showConfirmButton: false,
      showClass: {
        popup: 'animated fadeInDown faster',
      }
    });
  }

  showInfo(data: any) {

    Swal.fire({
      title: 'Info',
      html: `
      <div style='text-left'>
        type: ${data.type}<br>
        sended at: ${data.time}<br>
        data: ${data.data}<br>
        status: ${data.status}<br>
      </div>
      `
    });
    console.log(data);
  }

  forward(data: any) {
    this.isForwarding = true;
    this.forwardData = data;
  }

  closeForward(e: any) {
    this.isForwarding = false;
    this.forwardData = null;
  }

  resendMassage(index: any) {
    let obj: any = {
      ...this.data[index],
      id: Date.now(),
      status: 'pending'
    };
    this.setData(obj);
  }

  handleSearch(e: any) {
    const text = e.target.value;
    if (e.keyCode == 13) {

      function animate(div: any) {
        div.scrollIntoView({ behavior: "smooth", inline: "center" });
        div.style.transitionDuration = '200ms';
        div.style.background = 'rgba(0, 138, 188, 0.2)';
        setTimeout(() => {
          div.style.background = 'transparent'
        }, 1000)
      }

      if (this.searchInfo.curruntIndex >= this.searchInfo.length) {
        this.searchInfo.curruntIndex = 0;
      }
      const container: any = document.querySelector('.chats-container');
      const div: any = document.getElementById(this.searchArray[this.searchInfo.curruntIndex].id);
      animate(div);
      this.searchInfo.curruntIndex++;
    }
    else if (text != '') {
      this.searchArray = this.data.filter((element: any) => {
        if (element.type == 'string') {
          return element.data.indexOf(text) != -1;
        }
        return false;
      })
      this.searchInfo = {
        length: this.searchArray.length,
        curruntIndex: 0
      }
    }
  }
}