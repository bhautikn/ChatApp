import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiChatService } from '../../api-chat.service';
import { GifApiService } from '../../gif-api.service';

@Component({
  selector: 'app-post-by-id',
  templateUrl: './post-by-id.component.html',
  styleUrl: './post-by-id.component.css'
})
export class PostByIdComponent {
  constructor(
    private _route:ActivatedRoute, 
    private _api:ApiChatService,
    private _navigate: Router,
    private _gif_api:GifApiService
  ){}

  id:any = this._route.snapshot.params['id'];
  ngOnInit(){
    console.log(this.id);
  }
}
