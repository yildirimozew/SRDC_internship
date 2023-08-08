import { Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppComponent } from '../../app.component';
import { AES } from 'crypto-js';
import jwt_decode from 'jwt-decode';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  submitted = false;
  loginForm: FormGroup;
  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService,
    private appComponent: AppComponent
  ) {
    this.mainForm();
  }
  ngOnInit() {}
  mainForm() {
    this.loginForm = this.fb.group({
      username: [''],
      password: [''],
    });
  }
  get myForm() {
    return this.loginForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (!this.loginForm.valid) {
      return false;
    } else {
      return this.apiService.login(this.loginForm.value).subscribe((response) => {
        this.appComponent.isLoggedIn = true;
            
        const token = response.token;
      
        localStorage.setItem('token', token);

        const decodedToken = jwt_decode<any>(token);
        if(decodedToken.isAdmin) {
          this.appComponent.isAdmin = true;
        }
      
        this.ngZone.run(() => this.router.navigateByUrl('/sendmsg'));
      });
      };
    }

  }
