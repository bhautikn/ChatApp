import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { PostComponent } from './post/post.component';
import { HttpClientModule } from '@angular/common/http';
import { ChatSpaceComponent } from './chat-space/chat-space.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { FormsModule } from '@angular/forms';

const hostName = window.location.hostname;
const config: SocketIoConfig = { 

    url: 'http://'+hostName+':3000',
    options: { transports: ['websocket'] }
  };

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    PostComponent,
    ChatSpaceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    SocketIoModule.forRoot(config)
,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
