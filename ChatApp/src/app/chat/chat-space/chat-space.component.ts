import { Component, OnInit } from '@angular/core';
import { ChattingSoketService } from '../../services/chatting-soket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiChatService } from '../../services/api-chat.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { getAllChats } from '../../reducer/chat.selector';
import { addChat, deletePerticulerChat, resetChatData, updateData } from '../../reducer/chat.action';
import { decodeHTMLEntities, deleteChatByToken, editDataToFreind, formatAMPM, formateTime2, sendDataToFreind, tost } from '../../functions';


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

  textArea: any;
  urlToken: any = this._route.snapshot.params['token'];
  chatTitle: string = ''
  authToken: any = '';
  name = 'Your Freind';
  status: any = 'offline';

  data: any;
  curruntIndex: number = -1;
  chats: any = [];

  gifMenu: boolean = false;
  isVideoCall: boolean = false;
  isAudioCall: boolean = false;
  chatLefticons: boolean = true;
  isForwarding: boolean = false;
  forwardData: any;

  // date formatter
  formateTime = formateTime2;
  formatAMPM = formatAMPM;

  //searching chats
  searchingChat: boolean = false;
  searchArray: any = [];
  searchInfo: any = {
    curruntIndex: -1,
    lenght: 0,
  };

  //edit text
  editModeObj = {
    editing: false,
    id: null
  }
  //assets
  dropWater: any = new Audio('../assets/sounds/water_drop.mp3');

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
        history.back();
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
    this.textArea = document.querySelector('#textarea');
    var holder: any = document.querySelector('.main-container');
    const handleDragElement = (e: any) => {
      e.preventDefault();
      console.log(e.dataTransfer);
      try {
        this.uploadFile(null, e.dataTransfer.files[0]);
      } catch (e) {
        console.log(e);
      }
    }
    holder.ondragover = function () { this.style.border = '2px dashed green'; return false; };
    holder.ondragend = function () { this.style.border = '1px solid rgb(51, 51, 51)'; return false; };
    holder.ondrop = function (e: any) {
      handleDragElement(e);
      this.style.border = '1px solid rgb(51, 51, 51)';
    }

    // let gifMenu:any = document.querySelector('#gif-menu');
    // let reletivePos:any = document.querySelector('#textarea')?.getBoundingClientRect();

    // gifMenu.style.bottom = reletivePos.bottom + 'px';
    // gifMenu.style.left = reletivePos.left + 'px';

    // console.log(reletivePos.top, reletivePos, gifMenu.offsetHeight);
  }

  input(e: any) {
    if (e.target.value == '') {
      this.typing(false);
    }
    else {
      this.typing(true);
    }
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

    let text: string = this.textArea.value;

    if (text == "\n" || text == '' || !text || text.trim() == '') {
      this.typing(false);
      return;
    }

    setTimeout(() => {
      this.textArea.value = "";
      this.textArea.style.height = '0px';
    }, 1)

    var obj: any;

    if (this.editModeObj.editing) {
      obj = {
        data: text,
        lastMassage: `you: ${text}`,
        id: this.editModeObj.id,
        edited: true,
      }
    }
    else {
      obj = {
        type: 'string',
        miamitype: 'text/plain',
        data: text,
        sendableData: text,
        lastMassage: `you: ${text}`
      }
    }
    this.setData(obj);
  }

  async authanticate(token: any, password: any) {
    await this._api.authanticate(token, password).subscribe(async (data: any) => {
      if (data.login == false) {
        const { password, isConfirmed } = await this.passwordEnterPopUp('wrong password try again!!');
        if (!isConfirmed) {
          // this._navigate.navigate(['/post']);
          console.log('navigate to /post ', window.history)
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

  async deleteChat() {

    let res = await deleteChatByToken({
      urlToken: this.urlToken,
      authToken: this.authToken,
      api: this._api,
      store: this.store,
      curruntIndex: this.curruntIndex,
    });
    if (res) {
      this._navigate.navigate(['/']);
    }

  }

  redirect(to: string) {
    this.data = [];
    this._navigate.navigate([to]);
  }

  uploadFile(e: any, file: any = null) {
    file = file || e.target.files[0];

    let obj: any = {
      miamitype: file.type,
      data: URL.createObjectURL(file),
      sendableData: file
    }

    if (file.type.split('/')[0] == 'image') {
      obj.type = 'image';
    }
    else if (file.type.split('/')[0] == 'video') {
      obj.type = 'video';
    }
    else {
      obj.type = 'file';
    }

    obj.lastMassage = `you: sended ${obj.type}`
    this.setData(obj);
  }

  setData(obj: any) {
    this.curruntIndex = 0;
    obj.time = new Date().toString()
    obj.sended_or_recived = 'to';
    obj.status = 'pending';

    if (this.status == 'offline') {
      tost({ title: 'Your Freind is offline', icon: 'warning' }, true);
    }
    this.dropWater.play();
    if (this.editModeObj.editing) {
      editDataToFreind(obj, this._chat, this.authToken, this.urlToken, this.store);

      this.editModeObj = {
        editing: false,
        id: null
      }
    } else {
      obj.id = Date.now();
      sendDataToFreind(obj, this._chat, this.authToken, this.urlToken, this.store);
      
      setTimeout(() => {
        this.scrollTop();
      }, 50);
    }

    this.typing(false);
  }

  sendGif(data: any) {
    const obj = {
      type: 'gif',
      miamitype: 'text/plain',
      data: data,
      sendableData: data,
      lastMassage: 'you: sended gif'
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
      cancelButtonText: 'cancel',
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

  deletePerticulerChat(id: any) {
    this.store.dispatch(deletePerticulerChat({ id: id, token: this.urlToken }));
  }

  deleteForEveryOneChat(id: any) {
    this._chat.deleteForEveryOne(this.authToken, id);
    this.store.dispatch(deletePerticulerChat({ id: id, token: this.urlToken }));

  }

  setForEdit(id: any, data: any) {
    this.textArea.value = data;
    this.textArea.focus();

    this.editModeObj = {
      editing: true,
      id: id
    }
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
      status: 'pending',
      lastMassage: `you: ${this.data[index].data} `
    };
    this.setData(obj);
  }

  handleSearch(e: any) {
    const text = e.target.value;
    if (e.keyCode == 13) {
      this.incrementSearch(1);
    }
    else if (text != '') {
      this.searchArray = [];
      for (const element of this.data) {
        if (element.type == 'string') {
          if (element.data.indexOf(text) != -1) {
            this.searchArray.push(element);
          }
        }
      }
      this.searchInfo = {
        length: this.searchArray.length,
        curruntIndex: -1
      }
    }
  }

  incrementSearch(inc: number) {
    function animate(div: any) {
      div.scrollIntoView({ behavior: "smooth", inline: "center" });
      div.style.transitionDuration = '200ms';
      div.style.background = 'rgba(0, 138, 188, 0.2)';
      setTimeout(() => {
        div.style.background = 'transparent'
      }, 1000)
    }

    this.searchInfo.curruntIndex += inc;
    if (this.searchInfo.curruntIndex <= -1) {
      this.searchInfo.curruntIndex = this.searchArray.length - 1;
    }
    if (this.searchInfo.curruntIndex >= this.searchInfo.length) {
      this.searchInfo.curruntIndex = 0;
    }

    const div: any = document.getElementById(this.searchArray[this.searchInfo.curruntIndex].id);
    animate(div);
  }

  openSetting() {
    // todo: write code to open setting
  }

  closeOrOpenSearch(val: boolean) {
    if (val) {
      this.searchingChat = true;
      console.log('searchingChat', this.searchingChat);
      setTimeout(() => {
        document.getElementById('search-input')?.focus();
      }, 10);
    } else {
      this.searchingChat = false;
    }
  }
}