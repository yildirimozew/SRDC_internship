import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUri: string = 'http://localhost:4000/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private http: HttpClient, private router: Router) {}

  login(data): Observable<any> {
    let url = `${this.baseUri}/login`;
    return this.http.post(url, data).pipe(catchError(this.errorMgmt));
  }

  logout(): Observable<any> {
    let url = `${this.baseUri}/logout`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
    return this.http.post(url,null,{ headers }).pipe(catchError(this.errorMgmt));
  }

  getMessages() {
    return this.http.get(`${this.baseUri}`);
  }

  inbox(page: number, pageSize: number): Observable<any> {
    let url = `${this.baseUri}/inbox`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);
    const params = new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString());
    return this.http.get(url, { headers, params }).pipe(catchError(this.errorMgmt));
  }

  outbox(page: number, pageSize: number): Observable<any> {
    let url = `${this.baseUri}/outbox`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);
    const params = new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString());
    return this.http.get(url, { headers, params }).pipe(catchError(this.errorMgmt));
  }

  searchMessages(page: number, pageSize: number, search: string, inboxActive: boolean): Observable<any> {
    let url = `${this.baseUri}/search`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);
    const params = new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString()).set('search', search).set('inboxActive', inboxActive.toString());
    return this.http.get(url, { headers, params }).pipe(catchError(this.errorMgmt));
  }

  searchUsers(page: number, pageSize: number, search: string): Observable<any> {
    let url = `${this.baseUri}/searchusers`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);
    const params = new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString()).set('search', search);
    return this.http.get(url, { headers, params }).pipe(catchError(this.errorMgmt));
  }

  sortUsers(page:number, pageSize: number, sortOption: string): Observable<any> {
    let url = `${this.baseUri}/sortusers`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);
    const params = new HttpParams().set('pageSize', pageSize.toString()).set('sortOption', sortOption).set('page', page.toString());
    return this.http.get(url, { headers, params }).pipe(catchError(this.errorMgmt));
  }

  sortMessages(page:number, pageSize: number, sortOption: string, inboxActive: boolean): Observable<any> {
    let url = `${this.baseUri}/sortlist`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);
    const params = new HttpParams().set('pageSize', pageSize.toString()).set('sortOption', sortOption).set('inboxActive', inboxActive.toString()).set('page', page.toString());
    return this.http.get(url, { headers, params }).pipe(catchError(this.errorMgmt));
  }

  sendmsg(data): Observable<any> {
    let url = `${this.baseUri}/sendmsg`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);
    return this.http.post(url, data, { headers }).pipe(catchError(this.errorMgmt));
  }

  adduser(data): Observable<any> {
    let url = `${this.baseUri}/adduser`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);
    return this.http.post(url, data, {headers}).pipe(catchError(this.errorMgmt));
  }

  deleteuser(data): Observable<any> {
    let url = `${this.baseUri}/deleteuser`;
    return this.http.delete(url, data).pipe(catchError(this.errorMgmt));
  }

  deletemsg(messageId: string): Observable<any> {
    let url = `${this.baseUri}/deletemsg/${messageId}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);
    return this.http.delete(url, { headers }).pipe(catchError(this.errorMgmt));
  }  

  listusers(page: number, pageSize: number): Observable<any> {
    let url = `${this.baseUri}/listusers`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);
    const params = new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString());
    return this.http.get(url, { headers, params }).pipe(catchError(this.errorMgmt));
  }

  getusernames(): Observable<any> {
    let url = `${this.baseUri}/getusernames`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);
    return this.http.get(url, { headers }).pipe(catchError(this.errorMgmt));
  }

  deleteUser(userId: string): Observable<any> {
    let url = `${this.baseUri}/deleteuser/${userId}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);
    return this.http.delete(url, { headers }).pipe(catchError(this.errorMgmt));
  }  

  getUserByUsername(username: string): Observable<any> {
    const url = `${this.baseUri}/getuser/${username}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);
    return this.http.get(url, {headers}).pipe(catchError(this.errorMgmt));
  }

  updateUser(data): Observable<any> {
    let url = `${this.baseUri}/updateuser`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);
    return this.http.put(url, data, { headers }).pipe(catchError(this.errorMgmt));
  }

  getLogs(page: number, pageSize: number): Observable<any> {
    let url = `${this.baseUri}/logs`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);
    const params = new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString());
    return this.http.get(url, { headers, params }).pipe(catchError(this.errorMgmt));
  }

  searchLogs(page: number, pageSize: number, search: string): Observable<any> {
    let url = `${this.baseUri}/searchlogs`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);
    const params = new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString()).set('search', search);
    return this.http.get(url, { headers, params }).pipe(catchError(this.errorMgmt));
  }

  sortLogs(page:number, pageSize: number, sortOption: string): Observable<any> {
    let url = `${this.baseUri}/sortlogs`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);
    const params = new HttpParams().set('pageSize', pageSize.toString()).set('sortOption', sortOption).set('page', page.toString());
    return this.http.get(url, { headers, params }).pipe(catchError(this.errorMgmt));
  }

  errorMgmt = (error: HttpErrorResponse) => {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    if (error.status === 401) {
      this.logout();
    }
    return throwError(() => {
      return errorMessage;
    });
  }

}