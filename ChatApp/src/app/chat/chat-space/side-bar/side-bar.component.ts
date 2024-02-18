import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getChats } from '../../../../environments/environment.development';
import { ChattingSoketService } from '../../../services/chatting-soket.service';
import { Store } from '@ngrx/store';
import { getAllChats } from '../../../reducer/chat.selector';
import { deleteChat, resetresetUnreadToZero } from '../../../reducer/chat.action';
import { deleteChatByToken } from '../../../functions';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {

  constructor(
    private _route: ActivatedRoute,
    private _nevigate: Router,
    private _chat: ChattingSoketService,
    private store: Store,
  ) { }
  @Input() showtitle: boolean = true;
  @Input() selection: boolean = false;
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  @Output() onreload: EventEmitter<any> = new EventEmitter();

  isChangingName: boolean = false;
  urlToken: any = this._route.snapshot.params['token'];
  chats: any;
  dropWater: any = new Audio('../assets/sounds/water_drop.mp3');
  selectedObj: any = {};

  ngOnInit(): void {
    this.store.select(getAllChats).subscribe((data: any) => {
      this.chats = data.chat;
    })
    // setTimeout(()=>{
    // }, 50)
    // if (this.chats.length == 0) {
    //   this._nevigate.navigate(['/']);
    // };
  }
  redirect(to: string) {
    this._nevigate.navigate([to]);
    this.store.dispatch(resetresetUnreadToZero({ token: this.urlToken }))
    this.urlToken = to.split('/')[2];
    this.store.dispatch(resetresetUnreadToZero({ token: this.urlToken }))
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

    // deleteChatByToken({
    //   urlToken: this.chats[index].token,
    //   authToken: localStorage.getItem(this.chats[index].token),
    //   api: _,
    //   store: this.store,
    //   curruntIndex: index
    // });

    this.store.dispatch(deleteChat({ index: index }))
    // this._nevigate.navigate(['/']);
  }
  handleClick(token: any, i: any) {
    if (this.selection) {
      // console.log(this.selectedObj);
      if(this.selectedObj[token]){
        delete this.selectedObj[token];
      }else{
        this.selectedObj[token] = true;
      }
      this.onSelect.emit(this.selectedObj);
    } else {
      this.redirect('/chat/'+token);
    }
  }
  isKeyInObject(key:any){
    // console.log(key in  this.selectedObj)
    return key in this.selectedObj;
  }
}