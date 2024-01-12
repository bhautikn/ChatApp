import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GifApiService } from '../../gif-api.service';
import { PostApiService } from '../../post-service.service';
import { environment } from '../../../environments/environment.development';
import { PostComponent } from '../post.component';

@Component({
  selector: 'app-post-by-id',
  templateUrl: './post-by-id.component.html',
  styleUrl: './post-by-id.component.css'
})
export class PostByIdComponent {
  constructor(
    private _route:ActivatedRoute, 
    private _api:PostApiService,
    private _navigate: Router,
    private _gif_api:GifApiService
  ){}
  postComponentFunction:any = new PostComponent(this._api);

  id:any = this._route.snapshot.params['id'];
  post:any = {};
  comments:any = [];
  publicFolert:any = environment.apiUrl+'public/'; 


  myComments:string = '';
  myName:string = 'Anonymouse';

  ngOnInit(){
    this._api.getById(this.id).subscribe((res:any)=>{
      this.post = res;
    })
    this._api.getComments(this.id).subscribe((res:any)=>{
      this.comments = res;
    })
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

  postComment(){
    let comment:any = {
      text: this.myComments,
      from: this.myName,
      postId: this.id,
      like: 0,
      createdAt: new Date()
    }
    this._api.postComment(comment).subscribe((res:any)=>{
      console.log("Hello");
      comment._id = res._id;
      this.comments.unshift(comment)
    });
    this.myComments = ''

  }
  likeComment(_id:any, index:any){
    if(this.comments[index].isLiked == true){
      this.comments[index].like --;
      this.comments[index].isLiked = false;
      this._api.removeCommentDisLike(_id);
    }
    else{
      this.comments[index].like ++;
      this.comments[index].isLiked = true;
      this._api.addCommentDisLike(_id);
    }
  }
}
