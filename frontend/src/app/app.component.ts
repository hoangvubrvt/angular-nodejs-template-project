import { Component } from '@angular/core';
import { CustomerService } from './services/customer.service';
import { Observable } from 'rxjs';
import { Customer } from './models/customer.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor() { }
}
