import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-listusers',
  templateUrl: './listusers.component.html',
  styleUrls: ['./listusers.component.scss']
})
export class ListusersComponent implements OnInit {
  
  Users: any = [];
  filteredUsers: any = []; 
  searchTerm: string = ''; 
  sortOption: string = '';
  pageSize: number = 3; 
  currentPage: number = 1; 
  totalPages: number = 1; 
  pagedUsers: any[] = []; 
  
  constructor(private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute) { 
    this.getUsers();
  }
  
  ngOnInit() {}
  
  getUsers(){
    this.apiService.listusers(this.currentPage, this.pageSize).subscribe((data) => {
        this.pagedUsers = data.data;
        this.totalPages = data.numOfPages;
        if(this.searchTerm !== '') this.searchUsers();});
  }
  
  deleteUser(userId) {
    if (window.confirm('Are you sure you want to delete this user?')) {
      this.apiService.deleteUser(userId).subscribe((data) => {
          const deletedUserIndex = this.Users.findIndex((user) => user._id === userId);
        if (deletedUserIndex !== -1) {
          this.Users.splice(deletedUserIndex, 1);
    }});
    }
  }

  updateUser(userId) {
    this.router.navigateByUrl('/adduser', { state: { username: userId } });
  }

  searchUsers() {
    if(this.searchTerm === '') {
      this.getUsers();
    } else {
      this.apiService.searchUsers(this.currentPage, this.pageSize, this.searchTerm).subscribe((data) => {
        this.pagedUsers = data.data;
        this.totalPages = data.numOfPages;
      });
    }
  }

  sortUsers() {
    this.apiService.sortUsers(this.currentPage, this.pageSize, this.sortOption).subscribe((data) => {
      console.log(this.currentPage);
      this.pagedUsers = data.data;
      this.totalPages = data.numOfPages;
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      if(this.searchTerm !== '') this.searchUsers();
      else if(this.sortOption !== '') this.sortUsers();
      else this.getUsers();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      if(this.searchTerm !== '') this.searchUsers();
      else if(this.sortOption !== '') this.sortUsers();
      else this.getUsers();
    }
  }
}
