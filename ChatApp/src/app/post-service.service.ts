import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PostApiService {
  url = environment.apiUrl;
  constructor(private _http: HttpClient) { }

  getAll() {
    return this._http.get(this.url + 'posts');
  }
  getLimitedPost(from: number, to: number) {
    return this._http.get(this.url + 'some-posts/' + from + '/' + to);
  }
  getLimitedComment(from: number, to: number, id: any) {
    return this._http.get(this.url + 'post/comments/' + id + '/' + from + '/' + to);
  }
  getById(id: any) {
    return this._http.get(this.url + 'post/' + id);
  }
  getComments(id: any) {
    return this._http.get(this.url + 'post/comments/' + id);
  }
  submitReport(data: any) {
    return this._http.post(this.url + 'report', data);
  }
  newPost(data: any) {
    return this._http.post(this.url + 'post/new',
      data,
      {
        reportProgress: true,
        observe: "events"
      });
  }
  newLive(data:any){
    return this._http.post(this.url+'live/new', data);
  }
  postComment(data: any) {
    return this._http.post(this.url + 'post/add-comment/', data);
  }
  searchPost(data: any) {
    return this._http.get(this.url + 'posts/search/' + data.text);
  }
  addLike(_id: any) {
    console.log(this.url + '/post/like/' + _id);
    return this._http.put(this.url + 'post/like/' + _id, {}).subscribe();
  }
  addDisLike(_id: any) {
    return this._http.put(this.url + 'post/dislike/' + _id, {}).subscribe();
  }
  addView(_id: any) {
    return this._http.put(this.url+'post/view/'+_id, {}).subscribe();
  }
  removeLike(_id: any) {
    return this._http.put(this.url + 'post/remove-like/' + _id, {}).subscribe();
  }
  removeDisLike(_id: any) {
    return this._http.put(this.url + 'post/remove-dislike/' + _id, {}).subscribe();
  }
  addCommentDisLike(_id: any) {
    return this._http.put(this.url + 'post/comment/like/' + _id, {}).subscribe()
  }
  removeCommentDisLike(_id: any) {
    return this._http.put(this.url + 'post/comment/remove-like/' + _id, {}).subscribe()
  }
}
