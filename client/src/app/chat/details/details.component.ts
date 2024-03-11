import { Component, EventEmitter, Input, Output } from '@angular/core';
import { formatAMPM, formateDate } from '../../functions';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {
  @Input() data:any;
  @Output() onclose: EventEmitter<any> = new EventEmitter();
  formateDate = formateDate;
  formatAMPM= formatAMPM;
  close() {
    this.onclose.emit();
  }
}
