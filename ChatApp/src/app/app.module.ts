import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { PostComponent } from './post/post.component';
import { HttpClientModule } from '@angular/common/http';
import { ChatSpaceComponent } from './chat-space/chat-space.component';

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
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
