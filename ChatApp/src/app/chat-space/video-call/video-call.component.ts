import { Component } from '@angular/core';
import { ChattingSoketService } from '../../chatting-soket.service';
import { ActivatedRoute } from '@angular/router';

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

  urlToken: any = this._route.snapshot.params['token'];
  authToken = localStorage[this.urlToken];
  isConnected: boolean = true;

  ngOnInit() {
    this.dragElement(document.querySelector(".myVideoContainer"));
    this._chat.join(this.authToken);
    this.setMyVideo();


    // const otherVideo: any = document.querySelector('.otherVideo');

    // const mediaSource = new MediaSource();

    // otherVideo.src = URL.createObjectURL(mediaSource);
    // let sourceBuffer:any;
    // mediaSource.addEventListener('sourceopen', ()=>{
    //   sourceBuffer = mediaSource.addSourceBuffer('video/webm;codecs=vp8');
    // })
    // this._chat.onStreamVideo().subscribe((data: any) => {


    //   let fileReader = new FileReader();
    //   let arrayBuffer;

    //   fileReader.onloadend = () => {
    //       arrayBuffer = fileReader.result;
    //       sourceBuffer.appendBuffer(arrayBuffer)
    //   }
    //   fileReader.readAsArrayBuffer(new Blob([data.data]));

    // })

  }
  async setMyVideo() {
    const video: any = document.querySelector('.myVideo');

    video.muted = true;
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    }).then((stream) => {
      video.srcObject = stream;
      this.processStream(stream)
    });

  }
  processStream(stream: any) {
    const mediaRecorder = new MediaRecorder(stream)

    mediaRecorder.ondataavailable = (data) => {
      this._chat.streamVideo(this.authToken, data.data);
    }
    mediaRecorder.start()

    setInterval(() => {
      mediaRecorder.requestData()
    }, 2000)
  }


  
  dragElement(elmnt:any) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0
    elmnt.onmousedown = dragMouseDown;
  
    function dragMouseDown(e:any) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e:any) {
      e = e || window.event;
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
} 