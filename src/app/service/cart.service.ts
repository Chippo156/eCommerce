import { Injectable } from '@angular/core';
import { ProductService } from './product.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: Map<number, number> = new Map<number, number>();
  private cartSize: Map<number, string> = new Map<number, string>();

  constructor(private productService: ProductService) {
    const storeCart = localStorage.getItem('cart');
    const storeCartSize = localStorage.getItem('cartSize') || '';
    if (storeCart) {
      this.cart = new Map(JSON.parse(storeCart));
    }
  }
  addToCart(productId: number, quantity: number = 1, selectedSize: string) {
    {
      debugger;
      if (this.cart.has(productId)) {
        this.cart.set(productId, this.cart.get(productId)! + quantity);
        this.cartSize.set(productId, selectedSize);
      } else {
        this.cart.set(productId, quantity);
        this.cartSize.set(productId, selectedSize);
      }
      this.saveCartToLocalStorage();
    }
  }

  getCart(): Map<number, number> {
    return this.cart;
  }
  getCartSize(): Map<number, string> {
    return this.cartSize;
  }
  private saveCartToLocalStorage() {
    debugger;
    localStorage.setItem(
      'cart',
      JSON.stringify(Array.from(this.cart.entries()))
    );
    localStorage.setItem(
      'cartSize',
      JSON.stringify(Array.from(this.cartSize.entries()))
    );
  }
  clearCart() {
    this.cart.clear();
    this.saveCartToLocalStorage();
  }
  updateQuantity(productId: number, quantity: number) {
    this.cart.set(productId, quantity);
    this.saveCartToLocalStorage();
  }
  removeProduct(productId: number) {
    this.cart.delete(productId);
    this.saveCartToLocalStorage();
  }
}
