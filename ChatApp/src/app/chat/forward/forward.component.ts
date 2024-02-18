import { Attribute, Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiChatService } from '../../services/api-chat.service';
import { ChattingSoketService } from '../../services/chatting-soket.service';
import { Store } from '@ngrx/store';
import { appendData, changeStatus } from '../../reducer/chat.action';

@Component({
  selector: 'app-forward',
  templateUrl: './forward.component.html',
  styleUrl: './forward.component.css'
})
export class ForwardComponent {
  constructor(private _chat:ChattingSoketService, private store: Store){}
  @Input() data:any;
  @Output() onForward: EventEmitter<any> = new EventEmitter();
  members: any = {};

  handleClose(){
    this.onForward.emit();
  }
  addInList(e:any){
    this.members = e;
  }
  sendAll(){
    for (let i in this.members){
      const authToken:string = localStorage.getItem(i)!;
      const id = Date.now();
      this._chat.send(this.data.data || this.data.text ,this.data.type, authToken ,id, ({ id, status }: any) => {
        this.store.dispatch(changeStatus({ token: i, id: id, status: status}));
      });
      setTimeout(() => {
        const tempData = this.data.find((e: any) => e.id == id);
        if(tempData){
          tempData.status = 'pending';
          this.store.dispatch(changeStatus({ token: i, id: id, status: 'failed' }));
        }
      }, 20*1000);
      this.store.dispatch(appendData({ token: i, data: this.data }));
    }
    this.onForward.emit();
  }
}

