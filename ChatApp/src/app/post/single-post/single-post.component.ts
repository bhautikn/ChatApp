import { Component, Input, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { PostApiService } from '../../post-service.service';
import { environment, formateTime } from '../../../environments/environment.development';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrl: './single-post.component.css'
})
export class SinglePostComponent {

  constructor(private _api: PostApiService) { }
  @Input() post: any;
  @Input() showCommentsBtn: any;
  formateTime = formateTime;
  publicFoler: any = environment.apiUrl + 'public/';

  ngAfterViewInit() {

    const observer = new IntersectionObserver((entries: any) => {
      entries.forEach((entry: any) => {
        let video = entry.target.querySelector('video');
        if (entry.isIntersecting) {
          if (!this.post.visited) {
            this.post.visited = true;
            this._api.addView(this.post._id);
          }
          if (video) {
            video.play();
          }
        }
        else {
          if (video) {
            video.pause()
          }
        }
      });
    });

    const divContainer: any = document.getElementById(this.post._id);
    // console.log(divContainer)
    observer.observe(divContainer);

  }
  addLike(_id: any) {
    if (this.post.isDisLiked == true) {
      this.post.isLiked = false;
      this.addDisLike(_id)
      this.addLike(_id);
    }
    else if (this.post.isLiked == true) {
      this.post.like--;
      this.post.isLiked = false;
      this._api.removeLike(_id);
    }
    else {
      this.post.like++;
      this.post.isLiked = true;
      this._api.addLike(_id);
    }
  }
  addDisLike(_id: any) {
    if (this.post.isLiked == true) {
      this.post.isDisLiked = false;
      this.addLike(_id);
      this.addDisLike(_id);
    }
    else if (this.post.isDisLiked == true) {
      this.post.dislike--;
      this.post.isDisLiked = false;
      this._api.removeDisLike(_id);
    }
    else {
      this.post.dislike++;
      this.post.isDisLiked = true;
      this._api.addDisLike(_id);
    }
  }

  handleReport(id: any) {
    Swal.fire({
      title: 'Report',
      html: `
      `
    })
  }
  showImage(url: any) {
    Swal.fire({
      imageUrl: url,
      width: '100%',
      imageHeight: '100vh',
      showCloseButton: true,
      background: 'transparent',
      showConfirmButton: false,
      showClass: {
        popup: 'animated fadeInDown faster',
      }

    });
  }
}

class Post {
  title: string;
  description: string;
  like: number;
  dislike: number;
  view: number;
  files: any;

  constructor() {
    this.title = '';
    this.description = '';
    this.like = 0;
    this.dislike = 0;
    this.view = 0;
  }
}