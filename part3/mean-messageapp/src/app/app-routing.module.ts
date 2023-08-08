import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdduserComponent } from './components/adduser/adduser.component';
import { InboxComponent } from './components/inbox/inbox.component';
import { ListusersComponent } from './components/listusers/listusers.component';
import { LoginComponent } from './components/login/login.component';
import { SendmsgComponent } from './components/sendmsg/sendmsg.component';
import { LogsComponent } from './components/logs/logs.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  {path: 'logout', component: LoginComponent },
  { path: 'inbox', component: InboxComponent },
  { path: 'sendmsg', component: SendmsgComponent },
  { path: 'adduser', component: AdduserComponent },
  { path: 'listusers', component: ListusersComponent },
  { path: 'logs', component: LogsComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }