import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { PostComponent } from './post/post.component';
import { HttpClientModule } from '@angular/common/http';
import { ChatSpaceComponent } from './chat/chat-space/chat-space.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment.development';
import { SideBarComponent } from './chat/chat-space/side-bar/side-bar.component';
import { AddComponent } from './post/add/add.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PostByIdComponent } from './post/post-by-id/post-by-id.component';
import { VideoCallComponent } from './chat/chat-space/video-call/video-call.component';
import { BackNevigationComponent } from './back-nevigation/back-nevigation.component';
import { SearchComponent } from './post/search/search.component';
import { SidebarComponent } from './post/sidebar/sidebar.component';
import { LiveComponent } from './post/live/live.component';
import { SinglePostComponent } from './post/single-post/single-post.component';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { UploadComponent } from './post/live/upload/upload.component';
import { GIFComponent } from './gif/gif.component';
import { StoreModule } from '@ngrx/store';
import { chatReducer } from './reducer/chat.reducer';
import { ForwardComponent } from './chat/forward/forward.component';
import { OneChatComponent } from './chat/chat-space/side-bar/one-chat/one-chat.component';
import { AudioVisulizerComponent } from './chat/audio-visulizer/audio-visulizer.component';
import { AudioCallComponent } from './chat/chat-space/audio-call/audio-call.component';
import { ReplyTopComponent } from './chat/chat-space/reply-top/reply-top.component';

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
    UploadComponent,
    GIFComponent,
    ForwardComponent,
    OneChatComponent,
    AudioVisulizerComponent,
    AudioCallComponent,
    ReplyTopComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
    InfiniteScrollModule,
    StoreModule.forRoot({chat: chatReducer}),
  ],
  providers: [],
  bootstrap: [AppComponent],
  
})
export class AppModule { }