import { Component, OnChanges, OnInit } from '@angular/core';
import { ApiService } from './../../service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit{
  
  Message:any = [];
  filteredMessages: any = []; 
  searchTerm: string = ''; 
  sortOption: string = '';
  inboxActive: boolean = true;
  currentPage = 1;
  pageSize = 3;
  numberOfMessages: number;
  totalPages: number;
  pagedMessages: any[] = [];
  constructor(private apiService: ApiService, private router: Router) { 
  }
  ngOnInit() {
    this.toggleInbox(true);
  }

  delete(msgid) {
    if (window.confirm('Are you sure?')) {
      this.apiService.deletemsg(msgid).subscribe(() => {
        const deletedMessageIndex = this.pagedMessages.findIndex((message) => message._id === msgid);
      if (deletedMessageIndex !== -1) {
        this.pagedMessages.splice(deletedMessageIndex, 1);
      }});
    }
  }  

  searchMessages() {
    if(this.searchTerm === '') {
      this.toggleInbox(this.inboxActive);
    } else {
      this.apiService.searchMessages(this.currentPage, this.pageSize, this.searchTerm, this.inboxActive).subscribe((data) => {
        this.pagedMessages = data.data;
        this.totalPages = data.numOfPages;
      });
    }
  }

  sortMessages() {
    this.apiService.sortMessages(this.currentPage, this.pageSize, this.sortOption, this.inboxActive).subscribe((data) => {
      this.pagedMessages = data.data;
      this.totalPages = data.numOfPages;
    });
  }

  toggleInbox(inboxActive: boolean) {
    this.inboxActive = inboxActive;
    this.currentPage = 1;
    if (inboxActive) {
      this.apiService.inbox(this.currentPage, this.pageSize).subscribe((data) => {
        this.pagedMessages = data.data;
        this.totalPages = data.numOfPages;
        if(this.searchTerm !== '') this.searchMessages();
      });
    } else {
      this.apiService.outbox(this.currentPage, this.pageSize).subscribe((data) => {
        this.pagedMessages = data.data;
        this.totalPages = data.numOfPages;
        if(this.searchTerm !== '') this.searchMessages();
      });
    }
  }

  paginateMessages() {
    if(this.inboxActive){
      this.apiService.inbox(this.currentPage, this.pageSize).subscribe((data) => {
        this.pagedMessages = data.data;
      });
    }else{
      this.apiService.outbox(this.currentPage, this.pageSize).subscribe((data) => {
        this.pagedMessages = data.data;
      });
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      if(this.searchTerm !== '') this.searchMessages();
      else if(this.sortOption !== '') this.sortMessages();
      else this.paginateMessages();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      if(this.searchTerm !== '') this.searchMessages();
      else if(this.sortOption !== '') this.sortMessages();
      else this.paginateMessages();
    }
  }
}

