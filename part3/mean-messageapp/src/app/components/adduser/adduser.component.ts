import { Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.scss'],
})
export class AdduserComponent implements OnInit {
  submitted = false;
  adduserForm: FormGroup;
  isUpdateMode = false;
  confirmationMessage: string = '';
  showConfirmation: boolean = false;
  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService,
    private route: ActivatedRoute,
  ) {
    this.mainForm();
    const state = this.router.getCurrentNavigation().extras.state;
    if(state) {
      this.isUpdateMode = true; 
      this.adduserForm.patchValue({ username: state.username }); 
      this.fetchUserByUsernameData(state.username); 
    }
  }
  ngOnInit() {}
  mainForm() {
    this.adduserForm = this.fb.group({
      username: [''],
      password: [''],
      name: [''],
      surname : [''],
      gender : [''],
      isAdmin : [''],
      Birthday : [''],
    });
  }
  get myForm() {
    return this.adduserForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (!this.adduserForm.valid) {
      return false;
    } else {
      if(this.isUpdateMode) {
        return this.apiService.updateUser(this.adduserForm.value).subscribe({
          complete: () => {
            this.showConfirmationMessage('User updated successfully!');
              this.ngZone.run(() => this.router.navigateByUrl('/adduser'));
          },
          error: (e) => {
            console.log(e);
          },
        });
    }else{
      return this.apiService.adduser(this.adduserForm.value).subscribe({
        complete: () => {
            this.showConfirmationMessage('User added successfully!');
            this.ngZone.run(() => this.router.navigateByUrl('/adduser'));
        },
        error: (e) => {
          console.log(e);
        },
      });
    }
  }}

  resetForm() {
    this.isUpdateMode = false;
    this.adduserForm.reset();
  }

  setUpdateMode(user) {
    const birthdayDate = new Date(user[0].Birthday);
    const formattedBirthday = `${birthdayDate.getFullYear()}-${('0' + (birthdayDate.getMonth() + 1)).slice(-2)}-${('0' + birthdayDate.getDate()).slice(-2)}`;
    this.adduserForm.patchValue({
      username: user[0].username,
      password: user[0].password,
      name: user[0].name,
      surname: user[0].surname,
      gender: user[0].gender,
      isAdmin: String(user[0].isAdmin),
      Birthday: formattedBirthday, 
    });
  }

  toggleAddUser(isUpdateMode: boolean) {
    this.isUpdateMode = isUpdateMode;
  }

  fetchUserByUsername() {
    const username = this.adduserForm.controls['username'].value;
    if (!username) {
      return;
    }

    this.apiService.getUserByUsername(username).subscribe((userData) => {
      if (userData.length > 0) {
        this.setUpdateMode(userData);
      } else {
        console.log('User not found');
      }
    });
  }
  fetchUserByUsernameData(username) {
    this.apiService.getUserByUsername(username).subscribe((userData) => {
      if (userData) {
        this.setUpdateMode(userData);
      } else {
        console.log('User not found');
      }
    });
  }

  showConfirmationMessage(message: string) {
    this.confirmationMessage = message;
    this.showConfirmation = true;
  
    setTimeout(() => {
      this.ngZone.run(() => {
        this.showConfirmation = false;
      });
    }, 5000);}
}