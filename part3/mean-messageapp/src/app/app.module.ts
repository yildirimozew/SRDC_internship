import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './service/api.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { InboxComponent } from './components/inbox/inbox.component';
import { SendmsgComponent } from './components/sendmsg/sendmsg.component';
import { AdduserComponent } from './components/adduser/adduser.component';
import { ListusersComponent } from './components/listusers/listusers.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InboxComponent,
    SendmsgComponent,
    AdduserComponent,
    ListusersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
