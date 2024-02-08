import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getChats } from '../../../../environments/environment.development';
import { ChattingSoketService } from '../../../services/chatting-soket.service';
import { Store } from '@ngrx/store';
import { getAllChats } from '../../../reducer/chat.selector';
import { deleteChat } from '../../../reducer/chat.action';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {

  constructor(
    private _route: ActivatedRoute, 
    private _nevigate: Router,
    private _chat:ChattingSoketService,
    private store: Store,
  ) { }
  @Input() showtitle: boolean = true;
  @Output() onMessage: EventEmitter<any> = new EventEmitter();
  @Output() onreload: EventEmitter<any> = new EventEmitter();

  isChangingName: boolean = false;
  urlToken: any = this._route.snapshot.params['token'];
  chats: any;
  dropWater: any = new Audio('../assets/sounds/water_drop.mp3');

  ngOnInit(): void {
    this.store.select(getAllChats).subscribe((data:any)=>{
      this.chats = data.chat;
    })
    // if (this.chats.length == 0) {
    //   this._nevigate.navigate(['/']);
    // };
  }
  redirect(to: string) {
    this._nevigate.navigate([to]);
    this.onreload.emit(to);
  }
  handleChange(index: number, event: any) {
    console.log(event);
    if (event.keyCode == 13) {
      this.changeParticipentName(index, event);
    }
  }
  changeParticipentName(index: number, event: any) {
    console.log(index)
    this.isChangingName = false
  }
  handleDeleteChat(index: number) {
    // const { length , firstToken} = deleteChat(this.chats[index].token);
    this.store.dispatch(deleteChat({index: index}))
    // this._nevigate.navigate(['/']);
  }
}