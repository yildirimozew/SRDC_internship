import { Router } from '@angular/router';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from './service/api.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
  export class AppComponent implements OnInit {
    title = 'mean-messageapp';
    isLoggedIn = false;
    isAdmin = false;
    constructor(private apiService: ApiService) {}

    ngOnInit() {
      const token = localStorage.getItem('token');
      if (token) {
        this.isLoggedIn = true;
        const decodedToken = jwt_decode<any>(token);
        if (decodedToken.isAdmin) {
          this.isAdmin = true;
        }
      }
    }
    logout(){
      this.apiService.logout().subscribe();
      this.isLoggedIn = false;
      this.isAdmin = false;
    }
    
  }
