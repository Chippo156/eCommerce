import { Injectable } from '@angular/core';
import { ProductService } from './product.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: Map<number, number> = new Map<number, number>();

  constructor(private productService: ProductService) {
    const storeCart = localStorage.getItem('cart');
    if (storeCart) {
      this.cart = new Map(JSON.parse(storeCart));
    }
  }
  addToCart(productId: number, quantity: number = 1) {
    {
      debugger;
      if (this.cart.has(productId)) {
        this.cart.set(productId, this.cart.get(productId)! + quantity);
      } else {
        this.cart.set(productId, quantity);
      }
      this.saveCartToLocalStorage();
    }
  }

  getCart(): Map<number, number> {
    return this.cart;
  }
  private saveCartToLocalStorage() {
    debugger;
    localStorage.setItem(
      'cart',
      JSON.stringify(Array.from(this.cart.entries()))
    );
  }
  clearCart() {
    this.cart.clear();
    this.saveCartToLocalStorage();
  }
}
