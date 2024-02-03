import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {

  constructor(private _route:ActivatedRoute, private _nevigate:Router) { }
  
  isChangingName: boolean = false;
  urlToken:any = this._route.snapshot.params['token'];
  chats:any = this.getChats();

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
  redirect(to: string) {
    this._nevigate.navigate([to]);
  }
  handleChange(index:number, event: any){
    console.log(event);
    if(event.keyCode == 13){
      this.changeParticipentName(index, event);
    }
  }
  changeParticipentName(index: number, event: any){
    console.log(index)
    this.isChangingName = false
  }
}
