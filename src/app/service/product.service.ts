import { Injectable } from '@angular/core';
import { environtment } from '../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiGetProducts = `${environtment.apiBaseUrl}/products`;
  products: Product[] = [];
  totalPages: number = 0;
  constructor(private http: HttpClient) {}
  getProducts(
    keyword: string,
    category_id: number,
    page: number,
    limit: number
  ): Observable<any> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('category_id', category_id)
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<Product[]>(this.apiGetProducts, { params });
  }
  getProductDetails(id: number): Observable<any> {
    return this.http.get(`${this.apiGetProducts}/${id}`);
  }
  getProductByIds(productIds: number[]): Observable<any> {
    debugger;
    const params = new HttpParams().set('ids', productIds.join(','));
    return this.http.get<Product[]>(`${this.apiGetProducts}/by-ids`, {
      params,
    });
  }
  
}
