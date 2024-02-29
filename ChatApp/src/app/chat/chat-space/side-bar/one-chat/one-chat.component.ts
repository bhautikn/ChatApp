import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { deleteChat } from '../../../../reducer/chat.action';
import { formateDate, formateTime } from '../../../../functions';

@Component({
  selector: 'app-one-chat',
  templateUrl: './one-chat.component.html',
  styleUrl: './one-chat.component.css'
})
export class OneChatComponent {
  
  @Input() item: any;
  @Input() i: number = -1;
  @Input() selection: boolean = false;
  @Input() urlToken: boolean = false;
  formateTime = formateTime;

formateDate = formateDate;

  constructor(private store: Store){}
  
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
  showInfo(){
    
  }
}
