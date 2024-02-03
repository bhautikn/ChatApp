import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GifApiService } from '../services/gif-api.service';

@Component({
  selector: 'app-gif',
  templateUrl: './gif.component.html',
  styleUrl: './gif.component.css'
})
export class GIFComponent {
  
  constructor(private _gif_api: GifApiService){}

  @Output() onsendGif: EventEmitter<any> = new EventEmitter();

  gifs:any = [];

  ngOnInit(){

    // load gifs
    this._gif_api.getAll().subscribe((res: any) => {
      this.gifs = res.results;
    })
  }

  sendGif(url: any): void {
    this.onsendGif.emit(url);
  }

  changeGifText(e: any) {
    this._gif_api.getBySearch(e.target.value).subscribe((res: any) => {
      this.gifs = res.results;
    })
  }
}
