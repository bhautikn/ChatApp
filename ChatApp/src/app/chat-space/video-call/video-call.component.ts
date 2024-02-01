import { Component, EventEmitter, Output } from '@angular/core';
import { ChattingSoketService } from '../../chatting-soket.service';
import { ActivatedRoute } from '@angular/router';
import {Peer} from 'peerjs';

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

  urlToken: any = this._route.snapshot.params['token'];
  authToken = localStorage[this.urlToken];
  isConnected: boolean = true;
  // peer:Peer = new Peer();

  isVideo:boolean = true;
  isAudio:boolean = true;
  video:any = null;
  ngOnInit() {
    this.dragElement(document.querySelector(".myVideoContainer"));
    // this._chat.join(this.authToken);
    this.setMyVideo();
    // this._chat.onOtherUid()
    const otherVideo: any = document.querySelector('.otherVideo');

    // this.peer.on('call', (call) => {
    //   call.answer();
    //   call.on('stream', (stream) => {
    //     otherVideo.srcObject = stream;
    //     otherVideo.addEventListener('loadedmetadata', () => {
    //       otherVideo.play();
    //     });
    //   });
    // });


    var blobs: any = [];

    this._chat.onStreamVideo().subscribe((data: any) => {
      console.log(data);
      blobs.push(data);
      appendToSourceBuffer();
    })
    var mediaSource = new MediaSource();
    otherVideo.src = URL.createObjectURL(mediaSource);
    var sourceBuffer: any = null;


    mediaSource.addEventListener("sourceopen", function () {
      sourceBuffer = mediaSource.addSourceBuffer("video/webm; codecs=\"opus,vp8\"");
      sourceBuffer.addEventListener("updateend", appendToSourceBuffer);
    });


    function appendToSourceBuffer() {
      if (
        mediaSource.readyState === "open" &&
        sourceBuffer &&
        sourceBuffer.updating === false
      ) {
        sourceBuffer.appendBuffer(blobs.shift());
      }
    }
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
        this.processStream(stream)
    });

  }
  processStream(stream: any) {
    this.video.srcObject = stream;
    this.video.onloadedmetadata = function(e:any) {
      this.video.play();
    };
    const mediaRecorder = new MediaRecorder(stream)

    mediaRecorder.ondataavailable = (data) => {
      this._chat.streamVideo(this.authToken, data.data);
    }
    mediaRecorder.start()

    setInterval(() => {
      if(this.isVideo){
        mediaRecorder.requestData()
      }
    }, 500)
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
  setVideo(isVideo:boolean){
    if(isVideo){
      this.isVideo = false;
      this.video.srcObject.getVideoTracks()[0].stop();
    }
    else{
      this.isVideo = true
      // this.processStream(this.video.srcObject)
    }
  }
  endCall(){
    // this.setVideo(false);
    // history.back();
    this.onCutVideoCall.emit(true);
  }
} 