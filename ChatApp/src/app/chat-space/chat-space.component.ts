import { Component, OnInit } from '@angular/core';
import { ChattingSoketService } from '../chatting-soket.service';
import { ActivatedRoute } from '@angular/router';
// import {  }
// import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-chat-space',
  templateUrl: './chat-space.component.html',
  styleUrl: './chat-space.component.css'
})
export class ChatSpaceComponent implements OnInit{
  
  constructor( private _chat: ChattingSoketService, private _route:ActivatedRoute) { }
  authToken:any = '';
  password:any = 'bhautik123';
  token:any = '';
  ngOnInit(){

    this.token = this._route.snapshot.params['token'];

    this._chat.auth(this.token, this.password);

    this._chat.onId().subscribe((data)=>{

      console.log("recive data", data)
      this.authToken = data;

    })
    this._chat.onReceive().subscribe((data: any) => {

      this.addFrom(data, this.formatAMPM(new Date()));

    })

  }
  
  name = 'Your Freind';
  online: boolean = false;
  status = this.online ? 'online' : 'offline';
  statusColor = 'grey';
  data:any = '';

  input(e: any) {
    if (e.keyCode == 13) {
      let time = this.formatAMPM(new Date());
      this.addTo(e.target.value, time, e);
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
  addTo(text: string, time: string, e:any) {
    e.target.value = "";
    e.target.style.height = '0px';
    if(text == "\n") return;
    let child = `
    <div class="row">
        <div class="to">
            <div class="end"></div>
            <div class="massage">
                <div class="text">${text}</div>
                <div class="massage-status">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                        class="bi bi-check-all" viewBox="0 0 16 16">
                        <path
                            d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992a.252.252 0 0 1 .02-.022zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486-.943 1.179z" />
                    </svg>
                </div>
                <div class="time">${time}</div>
            </div>
        </div>
    </div>`
    this.data += child;

    this._chat.send(text, this.authToken);

    setTimeout(()=>{
      const container:any = document.querySelector('.chats-container');
      container.scrollTop = container.scrollTopMax;
    }, 50)
    
  }
  addFrom(text: string, time: string) {
    let child = `
    <div class="row">
        <div class="from">
            <div class="end"></div>
            <div class="massage">
                <div class="text">${text}</div>
                <div class="time">${time}</div>
            </div>
        </div>
    </div>`
    this.data += child;
    setTimeout(()=>{
      const container:any = document.querySelector('.chats-container');
      container.scrollTop = container.scrollTopMax;
    }, 50)
  }

  formatAMPM(date:Date) {
    var hours:any = date.getHours();
    var minutes:any = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }
}
