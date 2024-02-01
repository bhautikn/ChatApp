import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChattingSoketService } from '../../chatting-soket.service';
import { ActivatedRoute } from '@angular/router';
import { Peer } from 'peerjs';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrl: './video-call.component.css'
})
export class VideoCallComponent {
  constructor(
    private _chat: ChattingSoketService,
    private _route: ActivatedRoute,
    ) { }
    
    @Output() onCutVideoCall: EventEmitter<any> = new EventEmitter();
    @Input() authToken: any;

  isConnected: boolean = true;
  peerClient: Peer = new Peer();

  isVideo: boolean = true;
  isAudio: boolean = true;
  video: any = null;
  freindpeerToken:any = null;

  ngOnInit() {


    this.peerClient.on('open', (id)=>{
      this._chat.sendPeerConnectionId(this.authToken, id);
    })

    this.dragElement(document.querySelector(".myVideoContainer"));
    const otherVideo: any = document.querySelector('.otherVideo');

    this.peerClient.on('call', (call) => {
      console.log("called is called")
      call.answer();
      call.on('stream', (stream) => {
        otherVideo.srcObject = stream;
        otherVideo.addEventListener('loadedmetadata', () => {
          otherVideo.play();
        });
      });
    });
    
    this._chat.onPeerConnectionId().subscribe((id:any)=>{
      this.freindpeerToken = id;
      this.setMyVideo()
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
      this.video.srcObject = stream;
      this.peerClient.call(this.freindpeerToken, stream);
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
      this.video.srcObject.getVideoTracks()[0].stop();
    }
    else {
      this.isVideo = true
      // this.processStream(this.video.srcObject)
    }
  }
  endCall() {
    this.onCutVideoCall.emit(true);
  }
} 