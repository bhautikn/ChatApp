import { Component } from '@angular/core';
import { ApiChatService } from '../../api-chat.service';
import { HttpEventType } from '@angular/common/http';
import { PostApiService } from '../../post-service.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrl: './add.component.css',
})

export class AddComponent {
  constructor(private _api: PostApiService) { }

  videoId: string = '';
  progress: number = 0;
  formData: FormData = new FormData();
  isDone: boolean = false;
  isFaild: boolean = false;
  data: Form = new Form()

  submitForm() {
    this.formData.append('name', this.data.name as string);
    this.formData.append('title', this.data.title as string);
    this.formData.append('description', this.data.description as string);
    this.formData.append('tags', this.data.tags as string);
    this.progress = 1;

    this._api.newPost(this.formData).subscribe((res: any) => {
      if (res.status == 403) {
        this.isFaild = true;
        this.isDone = false;
        return;
      }
      else {
        if (res.type == HttpEventType.UploadProgress)
          this.progress = Math.round((100 / res.total) * res.loaded);
        if (this.progress == 100) {
          setTimeout(() => {
            if (res.body)
              this.videoId = res.body.id
            this.progress = 0;
            this.isDone = true;
            this.isFaild = false;
            this.clearForm();
          }, 500)
        }
      }
    })
  }

  imageData(e: any) {
    const file: File = e.target.files[0];
    if (file)
      this.formData.append('file', file);
  }

  clearForm() {
    this.data = new Form();
    this.formData = new FormData()
    let temp: any = document.querySelector('input[type="file"]');
    temp.value = ''
  }
}
class Form {
  name: String;
  title: String;
  description: String;
  tags: String;

  constructor() {
    this.name = 'Anonymouse';
    this.title = '';
    this.description = '';
    this.tags = '';
  }
}