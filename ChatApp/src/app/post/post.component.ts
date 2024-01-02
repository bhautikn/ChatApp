import { Component } from '@angular/core';
import { PostApiService } from '../post-service.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent {
  constructor(private _api:PostApiService){}

  data:any = '';

  ngOnInit(){
    this._api.getAll().subscribe((res:any)=>{
      this.data = res;
      console.log(res);
    })
  }
}

class Post{
  title: string;
  description: string;
  like: number;
  dislike: number;
  view: number;
  files: any;

  constructor(){
    this.title = '';
    this.description = '';
    this.like = 0;
    this.dislike = 0;
    this.view = 0;

  }
}