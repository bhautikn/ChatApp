import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChattingSoketService } from '../../../services/chatting-soket.service';
import { Peer } from 'peerjs';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrl: './video-call.component.css'
})
export class VideoCallComponent {
  constructor(
    private _chat: ChattingSoketService,
  ) { }

  @Output() onCutVideoCall: EventEmitter<any> = new EventEmitter();
  @Input() authToken: any;

  isConnected: boolean = true;
  peerClient: Peer = new Peer();

  isVideo: boolean = true;
  isAudio: boolean = true;
  video: any = null;
  freindpeerToken: any = null;
  localstream: any = null;
  connecting: boolean = true;

  ngOnInit() {
    this.setMyVideo()

    this._chat.onDisconnectVideoCall().subscribe(() => {
      this.clearAllTraks();
      this.closeVideoCall();
    })

    this.peerClient.on('open', (id) => {
      this._chat.sendPeerConnectionId(this.authToken, id);
    })

    this.peerClient.on('disconnected', () => {
      this.endCall();
    })

    const otherVideo: any = document.querySelector('.otherVideo');
    
    this.peerClient.on('call', (call) => {
      call.answer();
      call.on('stream', (stream) => {
        this.connecting = false;
        otherVideo.srcObject = stream;
        otherVideo.addEventListener('loadedmetadata', () => {
          otherVideo.play();
        });
      });
    });
    
    this.dragElement(document.querySelector(".myVideoContainer"));
    
    this._chat.onPeerConnectionId().subscribe((id: any) => {
      this.freindpeerToken = id;
      this.connecting = false;
      this.peerClient.call(this.freindpeerToken, this.localstream);
    })
  }
  async setMyVideo() {
    // let streamRef:any = null;
    const mediaDevices = navigator.mediaDevices;
    this.video = document.querySelector('.myVideo');
    this.video.muted = true;

    mediaDevices.getUserMedia({
      video: true,
      audio: true,
    }).then((stream) => {
      this.localstream = stream
      this.video.srcObject = this.localstream;
    });

  }

  dragElement(elmnt: any) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e: any) {
      // e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e: any) {
      // e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
  setVideo(isVideo: boolean) {
    if (isVideo) {
      this.isVideo = false;
      try{
        this.localstream.getVideoTracks().forEach((track: any) => {
          track.enabled = false;
        });
      }catch(e){
        console.log('error in stoping track', e)
      }
    }
    else {
      try{
        this.localstream.getVideoTracks().forEach((track: any) => {
          track.enabled = true;
        });
      }catch(e){
        console.log('error in stoping track', e)
      }
      this.isVideo = true
    }
  }
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
    this.closeVideoCall();
    this._chat.disconnectVideoCall(this.authToken);
  }
  
  closeVideoCall(){
    this.onCutVideoCall.emit(true);
  }

  clearAllTraks() {
    try{
      this.localstream.getTracks().forEach((track: any) => {
        track.stop();
      });
    }catch(e){
      console.log('error in stoping track', e);
    }
  }
} 