import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChattingSoketService } from '../../services/chatting-soket.service';
import { Store } from '@ngrx/store';
import { sendDataToFreind } from '../../functions';

@Component({
  selector: 'app-forward',
  templateUrl: './forward.component.html',
  styleUrl: './forward.component.css'
})
export class ForwardComponent {
  constructor(private _chat: ChattingSoketService, private store: Store) { }
  @Input() data: any;
  @Output() onForward: EventEmitter<any> = new EventEmitter();
  members: any = {};

  handleClose() {
    this.onForward.emit();
  }
  addInList(e: any) {
    this.members = e;
  }
  sendAll() {
    for (let i in this.members) {
      const authToken: string = localStorage.getItem(i)!;
      sendDataToFreind({...this.data, id: Date.now()}, this._chat, authToken, i, this.store);
    }
    this.onForward.emit();
  }
}

