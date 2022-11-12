import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { Order } from '../models/order.model';

/****
 * 
 * THIS SERVICE HAS BEEN CREATED TO HANDLE ALL THE METHODS BEING DONE ON (PRDOUCTS, ORDERS)
 * 
*/

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor(
    private http: HttpClient
  ) { }

  // GENERIC FUNCTION TO GET DATA INSIDE JSON FILES
  getJSON<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }

  getOrderById(id: string) {
    return this.http.get<Order[]>('/assets/data/orders.json')
      .pipe(
        map(orders => {
          // RETURN THE ORDER FOUND -> IF NOT RETURN AN EMPTY OBJECT
          return orders.find(item => item.OrderId === +id) || {};
        })
      )
  }
  
}