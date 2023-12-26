import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {

  constructor(private _route:ActivatedRoute) { }
  
  isOpenMenu:boolean = false;
  urlToken:any = this._route.snapshot.params['token'];
  chats:any = this.getChats();

  ngOnInit(){
    if(screen.width < 700){
      this.isOpenMenu = false;
    }
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
}
