import { Component, OnInit } from '@angular/core';
import { ChattingSoketService } from '../chatting-soket.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiChatService } from '../api-chat.service';
import { GifApiService } from '../gif-api.service';

@Component({
  selector: 'app-chat-space',
  templateUrl: './chat-space.component.html',
  styleUrl: './chat-space.component.css'
})
export class ChatSpaceComponent implements OnInit{
  
  constructor( 
    private _chat: ChattingSoketService, 
    private _route:ActivatedRoute, 
    private _api:ApiChatService,
    private _navigate: Router,
    private _gif_api:GifApiService
    ) { }

  urlToken:any = this._route.snapshot.params['token'];
  chatOption:boolean = false;
  isOpenMenu = true;
  online: boolean = false;
  gifMenu:boolean = false;
  authToken:any = '';
  name = 'Your Freind';
  status:any = 'offline';
  statusColor = 'grey';
  data:any = '';
  dataType = 'string';
  dropWater:any = new Audio('../assets/sounds/water_drop.mp3');
  chats:any = [];
  gifs:any = {}; 

  changeGifText(e:any){
    this._gif_api.getBySearch(e.target.value).subscribe((res:any)=>{
      this.gifs = res.results;
    })
  }
  ngOnInit(){
    if(screen.width < 700){
      this.isOpenMenu = false;
    }
    
    this.authToken = localStorage[this.urlToken];
    if(this.authToken == '' || !this.authToken){

      //set for login screen
      const password:any = prompt("Enter Password");
      this.authanticate(this.urlToken, password);
    }

    this._chat.join(this.authToken);

    //set status
    setTimeout(()=>{
      this.chats = this.getChats();
    } , 200)
    this._chat.status().subscribe((data:any)=>{
      this.status = data;
    })

    this._chat.onReceive().subscribe(({massage , dataType}:any) => {
      this.addFrom(massage, dataType);
      this.dropWater.play();
    })

    // load gifs
    this._gif_api.getAll().subscribe((res:any)=>{
      this.gifs = res.results;
    })

  }

  input(e: any) {
    this._chat.sendStatus('typing', this.authToken)
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
  addTo() {
    const textArea:any = document.querySelector('#textarea');
    let text:string = textArea.value;
    textArea.value = "";
    textArea.style.height = '0px';
    let time:any = this.formatAMPM(new Date()); 

    if(text == "\n" || text == '' || !text || text.trim() == '') return;
    let child = `
    <div class="row">
        <div class="to">
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
    // this.dropWater.play();
    // this.data += child;
    this.setData(child);
    this._chat.send(text, this.dataType ,this.authToken);
    this._chat.sendStatus('online', this.authToken);
    // setTimeout(()=>{
    //   const container:any = document.querySelector('.chats-container');
    //   container.scrollTop = container.scrollHeight;
    // }, 50)
    
  }
  addFrom(text: any, dataType: string) {
    const time: string = this.formatAMPM(new Date())
    var child = '';
    if(dataType == 'string'){
      child = `
      <div class="row">
          <div class="from">
              <div class="end"></div>
              <div class="massage">
                  <div class="text">${text}</div>
                  <div class="time">${time}</div>
              </div>
          </div>
      </div>`
    }
    else if(dataType == 'gif'){
      child = `
      <div class="row">
          <div class="from">
              <div class="end"></div>
              <div class="massage">
                  <img src='${text} 'class="text">
                  <div class="time">${time}</div>
              </div>
          </div>
      </div>`
    }
    else if(dataType == 'image'){
      const blob = new Blob([text])
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      let src:any;
      reader.onloadend = ()=>{
        src = reader.result;
        child = `
        <div class="row">
            <div class="from">
                <div class="end"></div>
                <div class="massage">
                    <img src='${src}'class="text">
                    <div class="time">${time}</div>
                </div>
            </div>
        </div>`
        this.setData(child);
      }
    }
    this.setData(child);
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

  authanticate(token:any, password:any){
    this._api.authanticate(token, password).subscribe((data:any)=>{
      if(data.login == false){
        password = prompt("Wrong password try again");
        this.authanticate(token, password);
      }else{
        let obj = {token: token, cretaed: this.formatAMPM(new Date()), name:''}
        this.setChat(obj);
        localStorage.setItem(token, data.id);
        return;
      }
    })
  }
  getChats(){
    if(!localStorage['chats']){
      let arr:any = [];
      localStorage['chats'] = JSON.stringify(arr);
    }
    return JSON.parse(localStorage['chats']);
  }

  setChat(newChat:any){
    let chats = this.getChats()
    chats.push(newChat);

    localStorage.setItem('chats', JSON.stringify(chats));
  }

  deleteChat(){
    let isDelete = confirm("are you sure??")
    if(isDelete){
      this._api.deleteChat(this.urlToken, this.authToken).subscribe((data:any)=>{
        if(data.ok == 200){
          localStorage.clear();
          this._navigate.navigate(['/']);
        }
      });
    }
  }
  sendGif(data:string){
    let time:any = this.formatAMPM(new Date()); 
    this.gifMenu = false;
    let child = `
    <div class="row">
        <div class="to">
            <div class="massage">
                <img src='${data}' class="text">
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
    this.setData(child)
    this._chat.sendStatus('online', this.authToken);

    this._chat.send(data, 'gif', this.authToken);
  }
  redirect(to:string){
    this.data = '';
    this._navigate.navigate([to]);
  }
  uploadFile(e:any){
    let file = e.target.files[0];
    const blob = new Blob([file])
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      let src:any;
      reader.onloadend = ()=>{
        src = reader.result;
    const child = `
    <div class="row">
        <div class="to">
            <div class="massage">
                <img src='${src}' class="text">
                <div class="massage-status">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                        class="bi bi-check-all" viewBox="0 0 16 16">
                        <path
                            d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992a.252.252 0 0 1 .02-.022zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486-.943 1.179z" />
                    </svg>
                </div>
                <div class="time">${this.formatAMPM(new Date())}</div>
            </div>
        </div>
    </div>
    `
    this.setData(child)
      }
    this._chat.send(e.target.files[0], 'image', this.authToken);
  }

  setData(child:any){
    this.dropWater.play();
    this.data += child;
    setTimeout(()=>{
      const container:any = document.querySelector('.chats-container');
      container.scrollTop = container.scrollHeight;
    }, 50)
  }
}
