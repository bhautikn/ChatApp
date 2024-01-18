import { Component, Input } from '@angular/core';
import Swal from 'sweetalert2';
import { PostApiService } from '../../post-service.service';
import { environment, formateTime } from '../../../environments/environment.development';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrl: './single-post.component.css'
})
export class SinglePostComponent {

  constructor(private _api:PostApiService){}
  @Input() post:any;
  @Input() showCommentsBtn:any;
  formateTime = formateTime;
  publicFoler:any = environment.apiUrl+'public/';

  ngOnInit(){
    // console.log(this.post);
    // console.log(formateTime(new Date(this.post.createdAt)))
  }

  addLike(_id:any){
    if(this.post.isDisLiked == true){
      this.post.isLiked = false;
      this.addDisLike(_id)
      this.addLike(_id);
    }
    else if(this.post.isLiked == true){
      this.post.like --;
      this.post.isLiked = false;
      this._api.removeLike(_id);
    }
    else{
      this.post.like ++;
      this.post.isLiked = true;
      this._api.addLike(_id);
    }
  }
  addDisLike(_id:any){
    if(this.post.isLiked == true){
      this.post.isDisLiked = false;
      this.addLike(_id);
      this.addDisLike(_id);
    }
    else if(this.post.isDisLiked == true){
      this.post.dislike --;
      this.post.isDisLiked = false;
      this._api.removeDisLike(_id);
    }
    else{
      this.post.dislike ++;
      this.post.isDisLiked = true;
      this._api.addDisLike(_id);
    }
  }

  handleReport(id: any){
    Swal.fire({
      title: 'Report',
      html: `
      `
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