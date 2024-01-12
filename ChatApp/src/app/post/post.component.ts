import { Component, ɵUSE_RUNTIME_DEPS_TRACKER_FOR_JIT } from '@angular/core';
import { PostApiService } from '../post-service.service';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent {
  constructor(private _api:PostApiService){}

  posts:any = '';
  publicFolert:any = environment.apiUrl+'public/';
  ngOnInit(){
    this._api.getAll().subscribe((res:any)=>{
      this.posts = res;
    })
    // var observer = new IntersectionObserver(function(entries) {
    //   if(entries[0].isIntersecting === true)
    //     console.log('Element is fully visible in screen');
    // }, { threshold: [1] });

    // let element:any = document.querySelector(".post-title")
    // setTimeout(()=>{observer.observe(element)}, 200);
    
  }

  addLike(_id:any, index:any){
    if(this.posts[index].isDisLiked == true){
      this.posts[index].isLiked = false;
      this.addDisLike(_id, index)
      this.addLike(_id, index);
    }
    else if(this.posts[index].isLiked == true){
      this.posts[index].like --;
      this.posts[index].isLiked = false;
      this._api.removeLike(_id);
    }
    else{
      this.posts[index].like ++;
      this.posts[index].isLiked = true;
      this._api.addLike(_id);
    }
  }
  addDisLike(_id:any, index:any){
    if(this.posts[index].isLiked == true){
      this.posts[index].isDisLiked = false;
      this.addLike(_id, index);
      this.addDisLike(_id, index);
    }
    else if(this.posts[index].isDisLiked == true){
      this.posts[index].dislike --;
      this.posts[index].isDisLiked = false;
      this._api.removeDisLike(_id);
    }
    else{
      this.posts[index].dislike ++;
      this.posts[index].isDisLiked = true;
      this._api.addDisLike(_id);
    }

  }
  redirect(post:any){
    console.log(post);
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