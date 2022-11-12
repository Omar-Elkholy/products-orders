import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
  
}
