import { Component, OnInit } from "@angular/core";
import { ApiService } from './../../service/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

@Component({
  standalone: true,
  selector: "app-logs",
  templateUrl: "./logs.component.html",
  styleUrls: ["./logs.component.scss"],
  imports: [FormsModule, CommonModule],
})

export class LogsComponent implements OnInit {
  logs: any = [];
  filteredLogs: any = [];
  searchTerm: string = '';
  sortOption: string = '';
  pageSize: number = 5;
  currentPage: number = 1;
  totalPages: number = 1;
  pagedLogs: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.getLogs();
  }

  getLogs() {
    this.apiService.getLogs(this.currentPage, this.pageSize).subscribe((data) => {
      this.pagedLogs = data.data;
      this.totalPages = data.numOfPages;
      if (this.searchTerm !== '') this.searchLogs();
    });
  }

  searchLogs() {
    if (this.searchTerm === '') {
      this.getLogs();
    } else {
      this.apiService.searchLogs(this.currentPage, this.pageSize, this.searchTerm).subscribe((data) => {
        this.pagedLogs = data.data;
        this.totalPages = data.numOfPages;
      });
    }
  }

  sortLogs() {
    this.apiService.sortLogs(this.currentPage, this.pageSize, this.sortOption).subscribe((data) => {
      this.pagedLogs = data.data;
      this.totalPages = data.numOfPages;
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      if (this.searchTerm !== '') this.searchLogs();
      else if (this.sortOption !== '') this.sortLogs();
      else this.getLogs();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      if (this.searchTerm !== '') this.searchLogs();
      else if (this.sortOption !== '') this.sortLogs();
      else this.getLogs();
    }
  }
}

