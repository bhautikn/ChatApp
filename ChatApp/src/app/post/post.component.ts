import { Component, Input } from '@angular/core';
import { PostApiService } from '../services/post-service.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent {
  constructor(
    private _api: PostApiService,
    private _navigate: Router,
  ) { }

  @Input() posts: any = [];
  // posts:any = [];

  postsPerScroll: number = 3;
  isShowSearch: boolean = false;
  start: number = 0;
  ngOnInit() {
    if (this.posts.length == 0) {
      this.nextPosts();
    }
    
  }

  redirect(path: any) {
    this._navigate.navigate([path]);
  }
  nextPosts() {
    this._api.getLimitedPost(this.start, this.start + this.postsPerScroll).subscribe((res: any) => {
      of(res).subscribe({
        next: response => {
          this.posts = [...this.posts, ...response];
        },
        error: console.log
      })
      this.start += this.postsPerScroll;
    })
  }
  handleSearch(e: any) {
    if (e.keyCode == 13) {
      this.redirect('/post/search/' + e.target.value);
    }
  }

  onScroll() {
    this.nextPosts();
  }
}
