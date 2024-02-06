import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Output() onreload: EventEmitter<any> = new EventEmitter();

  isChangingName: boolean = false;
  urlToken:any = this._route.snapshot.params['token'];
  chats:any = getChats();
  ngOnInit(): void {
    if(this.chats.length == 0){
      this._nevigate.navigate(['/']);
    };
  }
  redirect(to: string) {
    this._nevigate.navigate([to]);
    this.onreload.emit(to);
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