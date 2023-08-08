import { Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TypeaheadMatch} from 'ngx-bootstrap/typeahead';

@Component({
  selector: 'app-sendmsg',
  templateUrl: './sendmsg.component.html',
  styleUrls: ['./sendmsg.component.scss'],
})

export class SendmsgComponent implements OnInit {
  submitted = false;
  sendMsgForm: FormGroup;
  receivers: string[] = [];
  filteredreceivers: string[] = [];
  searchTerm: string = '';
  confirmationMessage: string = '';
  showConfirmation: boolean = false;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService
  ) {
    this.mainForm();
    this.apiService.getusernames().subscribe((data) => {
      for(let i = 0; i < data.length; i++) {
        this.receivers.push(data[i].username);
      }
    })
  }

  ngOnInit() {}

  mainForm() {
    this.sendMsgForm = this.fb.group({
      receiver: ['', Validators.required],
      title: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  get sendMsgFormControls() {
    return this.sendMsgForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (!this.sendMsgForm.valid) {
      return false;
    } else {
      return this.apiService.sendmsg(this.sendMsgForm.value).subscribe({
        complete: () => {
          this.showConfirmationMessage('Message sent successfully!');
          this.ngZone.run(() => this.router.navigateByUrl('/sendmsg'));
        },
        error: (e) => {
          console.log(e);
        },
      });
    }
  }

  filterOptions(): void {
    this.filteredreceivers = this.receivers.filter((option) =>
      option.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onSelect(option: string): void {
    this.searchTerm = option;
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
