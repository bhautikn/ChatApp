import { Component } from '@angular/core';
import { PostApiService } from '../../services/post-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  constructor(
    private _api:PostApiService,
    private _route:ActivatedRoute,
  ){}

  searchItems:any = [];
  searchText:string = this._route.snapshot.params['text'];

  ngOnInit(){
    this._api.searchPost({text: this.searchText}).subscribe((res:any)=>{
      this.searchItems = res;
    })
  }

}
