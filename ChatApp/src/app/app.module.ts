import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { PostComponent } from './post/post.component';
import { HttpClientModule } from '@angular/common/http';
import { ChatSpaceComponent } from './chat-space/chat-space.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment.development';
import { SideBarComponent } from './side-bar/side-bar.component';
import { AddComponent } from './post/add/add.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PostByIdComponent } from './post/post-by-id/post-by-id.component';
import { VideoCallComponent } from './chat-space/video-call/video-call.component';
import { BackNevigationComponent } from './back-nevigation/back-nevigation.component';
import { SearchComponent } from './post/search/search.component';
import { SidebarComponent } from './post/sidebar/sidebar.component';
import { LiveComponent } from './post/live/live.component';
import { SinglePostComponent } from './post/single-post/single-post.component';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { UploadComponent } from './post/live/upload/upload.component';

const config: SocketIoConfig = {
    url: environment.soketUrl,
    options: { transports: ['websocket']},
  };

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    PostComponent,
    ChatSpaceComponent,
    SideBarComponent,
    AddComponent,
    PostByIdComponent,
    VideoCallComponent,
    BackNevigationComponent,
    SearchComponent,
    SidebarComponent,
    LiveComponent,
    SinglePostComponent,
    UploadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    CommonModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
    InfiniteScrollModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  
})
export class AppModule { }