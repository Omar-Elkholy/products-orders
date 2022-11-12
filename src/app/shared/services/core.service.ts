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

  // ORDERS ADDED MANUALLY FROM USER
  addedOrders: Order[] = [];

  constructor(
    private http: HttpClient
  ) {
    this.getUserAddedOrders();
  }

  // GENERIC FUNCTION TO GET DATA INSIDE JSON FILES
  getJSON<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }

  getOrderById(id: string) {
    return this.http.get<Order[]>('/assets/data/orders.json')
      .pipe(
        map(orders => {
          // RETURN THE ORDER FOUND -> IF NOT RETURN AN EMPTY OBJECT
          orders = [...this.addedOrders, ...orders]
          return orders.find(item => item.OrderId === +id) || {};
        })
      )
  }

  // GET ORDERS ADDED MANUALLY FROM USER
  getUserAddedOrders() {
    const addedOrders = localStorage.getItem('addedOrders')
    if (addedOrders) {
      this.addedOrders = JSON.parse(addedOrders);
    }
  }

}