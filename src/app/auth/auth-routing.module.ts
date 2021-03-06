import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {AuthComponent} from './auth/auth.component';
import {ForgetPassComponent} from './forget-pass/forget-pass.component';
import {NewpassComponent} from './newpass/newpass.component';
import {GuestGuard} from '@app/guards';
import {NewpassGuard} from '@app/guards';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    canActivate: [GuestGuard],
    canActivateChild: [GuestGuard],
    children: [
      {path: 'forget', component: ForgetPassComponent},
      {path: 'newpass', component: NewpassComponent, canActivate: [NewpassGuard]},
      {path: 'nova-senha', component: NewpassComponent, canActivate: [NewpassGuard]},
      {path: '**', component: LoginComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
