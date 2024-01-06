import { Component } from '@angular/core';
import { ChattingSoketService } from '../../chatting-soket.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrl: './video-call.component.css'
})
export class VideoCallComponent {
  constructor(
    private _chat:ChattingSoketService, 
    private _navigate: Navigator,
    private _route:ActivatedRoute,
  ){}

  urlToken:any = this._route.snapshot.params['token'];
  authToken = localStorage[this.urlToken];

  ngOnInit(){
    this._chat.sendVideoCall(this.authToken, (data:any)=>{
      console.log(data)
    });
  }
}
