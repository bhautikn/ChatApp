import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-reply-top',
  templateUrl: './reply-top.component.html',
  styleUrl: './reply-top.component.css'
})
export class ReplyTopComponent {
  @Input() replyMode:any; 
  @Output() onclick:EventEmitter<any> = new EventEmitter();

  handleClick(){
    this.onclick.emit(this.replyMode);
  }
}
