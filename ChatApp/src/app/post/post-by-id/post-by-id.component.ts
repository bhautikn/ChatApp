import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GifApiService } from '../../gif-api.service';
import { PostApiService } from '../../post-service.service';
import { environment, formateTime } from '../../../environments/environment.development';
import { of } from 'rxjs';

@Component({
  selector: 'app-post-by-id',
  templateUrl: './post-by-id.component.html',
  styleUrl: './post-by-id.component.css'
})
export class PostByIdComponent {
  constructor(
    private _route: ActivatedRoute,
    private _api: PostApiService,
  ) { }
  // postComponentFunction:any = new PostComponent(this._api);
  commentsPerScroll: number = 5;
  start: number = 0;
  dataOver:boolean = false;
  id: any = this._route.snapshot.params['id'];
  post: any = {};
  comments: any = [];
  publicFolert: any = environment.apiUrl + 'public/';
  myComments: string = '';
  myName: string = 'Anonymouse';
  formateTime = formateTime;
  ngOnInit() {
    this._api.getById(this.id).subscribe((res: any) => {
      this.post = res;
    })
    this.getComments();
  }
  postComment() {
    let comment: any = {
      text: this.myComments,
      from: this.myName,
      postId: this.id,
      like: 0,
      createdAt: new Date()
    }
    this._api.postComment(comment).subscribe((res: any) => {
      comment._id = res._id;
      this.comments.unshift(comment)
    });
    this.myComments = ''
  }

  likeComment(_id: any, index: any) {
    if (this.comments[index].isLiked == true) {
      this.comments[index].like--;
      this.comments[index].isLiked = false;
      this._api.removeCommentDisLike(_id);
    }
    else {
      this.comments[index].like++;
      this.comments[index].isLiked = true;
      this._api.addCommentDisLike(_id);
    }
  }
  getComments() {
    this._api.getLimitedComment(this.start, this.start + this.commentsPerScroll, this.id).subscribe((res: any) => {
      if(!res.dataOver){
        of(res).subscribe({
          next: response => this.comments = [...this.comments, ...response],
          error: console.log
        })
      }
      else{
        this.dataOver = true;
      }
    })
    this.start += this.commentsPerScroll;
  }
  onScroll() {
    console.log('scrolled');
    this.getComments();
  }
}
