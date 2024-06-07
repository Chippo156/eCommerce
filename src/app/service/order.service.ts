import { Injectable } from '@angular/core';
import { environtment } from '../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { OrderDTO } from '../dtos/orderDto';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiOrderBase = `${environtment.apiBaseUrl}/orders`;

  constructor(private http: HttpClient, private userService: UserService) {}

  placeOrder(orderDTO: OrderDTO): Observable<any> {
    return this.http.post(this.apiOrderBase, orderDTO, {});
  }
}
