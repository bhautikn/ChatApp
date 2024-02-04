import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getChats } from '../../../../environments/environment.development';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {

  constructor(private _route:ActivatedRoute, private _nevigate:Router) { }
  @Input() showtitle: boolean = true;

  isChangingName: boolean = false;
  urlToken:any = this._route.snapshot.params['token'];
  chats:any = getChats();

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
  handleDeleteChat(){
    //todo: delete chat from local storage
    
    // let chats = getChats();
    // chats.splice(this.urlToken, 1);
    // localStorage.setItem('chats', JSON.stringify(chats));
    // this._nevigate.navigate(['chat']);
  }
}
