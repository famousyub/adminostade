import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from '../model/user';
import {Product} from '../model/product';
import {Transaction} from '../model/transaction';

let API_URL = "http://localhost:8081/api/user/";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public currentUser: Observable<User>;
  private currentUserSubject: BehaviorSubject<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }



  login(usernameOrEmail: string, password: string) {
    return this.http.post<any>(API_URL+ "login", { usernameOrEmail, password })
      .pipe(map(customer => {

        if (customer && customer.token) {
            // store customer details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('customer', JSON.stringify(customer));
            localStorage.setItem('currentUser', JSON.stringify(customer));
            this.currentUserSubject.next(customer);
        }
       
        return customer;
      }));
  }


  login2(user: User): Observable<any> {
    const headers = new HttpHeaders(user ? {
      authorization:'Basic ' + btoa(user.username + ':' + user.password)
    }:{});

    return this.http.post<any> (API_URL + "login",user)
    .pipe(map(response => {
      if(response){
        localStorage.setItem('currentUser', JSON.stringify(response));
        this.currentUserSubject.next(response);
      }
      return response;
    }));
  }

  getCustomerReservations(customerId: number) {
    return this.http.get<any[]>(API_URL + '/api/customer/GetCustomerReservations/' + customerId);
  }

  logOut(): Observable<any> {
    return this.http.post(API_URL + "logout", {})
    .pipe(map(response => {
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
    }));
  }

  register(user: User): Observable<any> {
    return this.http.post(API_URL + "registration", JSON.stringify(user),
  {headers: {"Content-Type":"application/json; charset=UTF-8"}});
  }

  findAllProducts(): Observable<any> {
    return this.http.get(API_URL + "products",
  {headers: {"Content-Type":"application/json; charset=UTF-8"}});
  }

  purchaseProduct(transaction: Transaction): Observable<any> {
    return this.http.post(API_URL + "purchase", JSON.stringify(transaction),
  {headers: {"Content-Type":"application/json; charset=UTF-8"}});
  }
}
