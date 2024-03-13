import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiChatService } from '../../services/api-chat.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrl: './invite.component.css'
})
export class InviteComponent {

  constructor(private _api: ApiChatService) { }
  @Input() fullUrl: any = window.location.href;
  @Input() showClose: any = true;
  @Output() onclose = new EventEmitter();
  // @Input() urlToken: any;
  email: any;
  comment: any;
  sendEmailLoading:any = false;
  
  handleClose(){
    this.onclose.emit();
  }
  inviteFreind() {
    console.log(this.email, this.comment, this.fullUrl)
    if (this.email == '' || this.comment == '' || this.email == undefined || this.comment == undefined) {
      return alert('Please fill the email and comment');
    }
    this.sendEmailLoading = true;
    this._api.sendEmail(this.email, this.comment, this.fullUrl).subscribe((data: any) => {
      if (data.status == 200) {
        this.sendEmailLoading = false;
        Swal.fire({
          title: 'Email sent',
          text: 'The email has been sent successfully',
          icon: 'success',
          customClass: 'swal-background',
          confirmButtonText: 'OK'
        })
      } else {
        alert('Email not sent');
      }
    });
  }
}
