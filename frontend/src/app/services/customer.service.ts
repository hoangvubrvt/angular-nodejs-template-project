import { Injectable } from '@angular/core';
import { Customer } from '../models/customer.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { Response } from '../models/response.model';
@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  public findAll(): Observable<Customer> {
    return this.http.get<Response>("api/customers").pipe(
      map(response => {
        let customer: Customer = response.data;
        return response.data;
      })
    );
  }
}
