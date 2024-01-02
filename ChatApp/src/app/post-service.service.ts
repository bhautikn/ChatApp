import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostApiService {
  url = environment.apiUrl;
  constructor(private _http: HttpClient) { }

  getAll(){
    return this._http.get(this.url + 'posts');
  }
  getById(id: any){
    return this._http.get(this.url+'post/'+id);
  }
  submitReport(data:any){
    return this._http.post(this.url+'report', data);
  }
  newPost(data: any) {
    return this._http.post(this.url + 'post/new',
      data,
      {
        reportProgress: true,
        observe: "events"
      });
  }
}
