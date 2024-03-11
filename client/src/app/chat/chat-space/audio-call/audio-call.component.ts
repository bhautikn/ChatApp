import { Component, EventEmitter, Input, Output } from '@angular/core';
import Peer from 'peerjs';
import { ChattingSoketService } from '../../../services/chatting-soket.service';

@Component({
  selector: 'app-audio-call',
  templateUrl: './audio-call.component.html',
  styleUrl: './audio-call.component.css'
})
export class AudioCallComponent {

  constructor(
    private _chat: ChattingSoketService,
  ) { }

  @Output() onCutAudioCall: EventEmitter<any> = new EventEmitter();
  @Input() authToken: any;

  isConnected: boolean = true;
  peerClient: Peer = new Peer();

  // isVideo: boolean = true;
  isAudio: boolean = true;
  audio: any = null;
  freindpeerToken: any = null;
  localstream: any = null;
  networkStream: any = null;
  connecting: boolean = true;

  ngOnInit() {
    this.setMyAudio()

    this._chat.onDisconnectAudioCall().subscribe(() => {
      this.clearAllTraks();
      this.closeAudioCall();
    })

    this.peerClient.on('open', (id) => {
      this._chat.sendPeerConnectionId(this.authToken, id);
    })

    this.peerClient.on('disconnected', () => {
      this.endCall();
    })

    const otherAudio: any = document.querySelector('.otherAudio');
    
    this.peerClient.on('call', (call) => {
      call.answer();
      call.on('stream', (stream) => {
        this.connecting = false;
        this.networkStream = stream;
        otherAudio.srcObject = stream;
        otherAudio.addEventListener('loadedmetadata', () => {
          otherAudio.play();
        });
      });
    });
    
    // this.dragElement(document.querySelector(".myVideoContainer"));
    
    this._chat.onPeerConnectionId().subscribe((id: any) => {
      this.freindpeerToken = id;
      this.connecting = false;
      this.peerClient.call(this.freindpeerToken, this.localstream);
    })
  }
  async setMyAudio() {
    // let streamRef:any = null;
    const mediaDevices = navigator.mediaDevices;
    this.audio = document.querySelector('.myAudio');
    this.audio.muted = true;

    mediaDevices.getUserMedia({
      audio: true,
    }).then((stream) => {
      console.log('get user media successfully', stream);
      this.localstream = stream
      this.audio.srcObject = this.localstream;
    });

  }

  // dragElement(elmnt: any) {
  //   var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0
  //   elmnt.onmousedown = dragMouseDown;

  //   function dragMouseDown(e: any) {
  //     // e = e || window.event;
  //     e.preventDefault();
  //     // get the mouse cursor position at startup:
  //     pos3 = e.clientX;
  //     pos4 = e.clientY;
  //     document.onmouseup = closeDragElement;
  //     // call a function whenever the cursor moves:
  //     document.onmousemove = elementDrag;
  //   }

  //   function elementDrag(e: any) {
  //     // e = e || window.event;
  //     e.preventDefault();
  //     // calculate the new cursor position:
  //     pos1 = pos3 - e.clientX;
  //     pos2 = pos4 - e.clientY;
  //     pos3 = e.clientX;
  //     pos4 = e.clientY;
  //     // set the element's new position:
  //     elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
  //     elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  //   }

  //   function closeDragElement() {
  //     /* stop moving when mouse button is released:*/
  //     document.onmouseup = null;
  //     document.onmousemove = null;
  //   }
  // }
  // setAudio(isVideo: boolean) {
  //   if (isVideo) {
  //     this.isAudio = false;
  //     try{
  //       this.localstream.getVideoTracks().forEach((track: any) => {
  //         track.enabled = false;
  //       });
  //     }catch(e){
  //       console.log('error in stoping track', e)
  //     }
  //   }
  //   else {
  //     try{
  //       this.localstream.getVideoTracks().forEach((track: any) => {
  //         track.enabled = true;
  //       });
  //     }catch(e){
  //       console.log('error in stoping track', e)
  //     }
  //     this.isVideo = true
  //   }
  // }
  setAudio(isAudio: boolean) {
    if (isAudio) {
      this.isAudio = false;
      try{
        this.localstream.getAudioTracks().forEach((track: any) => {
          track.enabled = false;
        });
      }catch(e){
        console.log('error in stoping track', e)
      }
    }
    else {
      try{
        this.localstream.getAudioTracks().forEach((track: any) => {
          track.enabled = true;
        });
      }catch(e){
        console.log('error in stoping track', e)
      }
      this.isAudio = true
    }
  }

  endCall() {
    this.clearAllTraks();
    this.closeAudioCall();
    this._chat.disconnectAudioCall(this.authToken);
  }
  
  closeAudioCall(){
    this.onCutAudioCall.emit(true);
  }

  clearAllTraks() {
    if(this.localstream){
      try{
        this.localstream.getAudioTracks().forEach((track: any) => {
          console.log(track);
          track.stop();
        });
      }catch(e){
        console.log('error in stoping track', e);
      }
    }
  }
}
