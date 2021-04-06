import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IAddress } from '../shared/models/address';
import { IUser } from '../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<IUser>(1);
  currentUser$ = this.currentUserSource.asObservable();
  private isAdminSource = new ReplaySubject<boolean>(1);
  isAdmin$ = this.isAdminSource.asObservable();
  constructor(private http: HttpClient, private router: Router) { }


  loadCurrentUser(token: string): Observable<any> {
    if (token === null) {
      this.currentUserSource.next(undefined);
      return of(undefined);
    }
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get<IUser>(this.baseUrl + 'account', { headers }).pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
          this.isAdminSource.next(this.isAdmin(user.token));

        }
      })
    );
  }



  login(value: any) {
    return this.http.post<IUser>(this.baseUrl + 'account/login', value).pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
          this.isAdminSource.next(this.isAdmin(user.token));

        }
      })
    );
  }


  register(value: any) {
     return this.http.post<IUser>(this.baseUrl + 'account/register', value).pipe(
       map((user: IUser) => {
         if (user) {
           localStorage.setItem('token', user.token);
           this.currentUserSource.next(user);
         }
       })
     );
  }


  logout() {
    localStorage.removeItem('token');
    this.currentUserSource.next(undefined);
    this.isAdminSource.next(undefined);
    this.router.navigateByUrl('/');
  }
  checkEmailExists(email: string) {
    return this.http.get(this.baseUrl + 'account/emailexists?email=' + email);
  }


  getUserAddress(){
    return this.http.get<IAddress>(this.baseUrl + 'account/address');
  }


  updateUserAddress(address: IAddress){
    return this.http.put<IAddress>(this.baseUrl + 'account/address', address);
  }


  isAdmin(token: string): boolean | undefined {
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      if (decodedToken.role.indexOf('Admin') > -1) {
        return true;
      }
      else{
        return undefined;
      }
    }
    else {
      return undefined;
    }
  }
}
