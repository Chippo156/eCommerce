import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { ProductService } from '../../service/product.service';
import { CartService } from '../../service/cart.service';
import { environtment } from '../../environments/environment';

@Component({
  selector: 'app-cart-detail',
  templateUrl: './cart-detail.component.html',
  styleUrl: './cart-detail.component.scss',
})
export class CartDetailComponent implements OnInit {
  cartItems: { product: Product; quantity: number }[] = [];
  couponCode: string = '';
  totalMoney: number = 0;
  subTotal: number = 0;
  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}
  ngOnInit(): void {
    debugger;
    const cart = this.cartService.getCart();
    const productIds = Array.from(cart.keys());
    this.productService.getProductByIds(productIds).subscribe({
      next: (products: Product[]) => {
        debugger;
        this.cartItems = productIds.map((productId) => {
          debugger;
          const product = products.find((p: Product) => p.id === productId);
          if (product) {
            product.url = `${environtment.apiBaseUrl}/products/viewImages/${product.thumbnail}`;
          }
          return { product: product!, quantity: cart.get(productId)! };
        });
        console.log('haha');
      },
      complete: () => {
        debugger;
        this.calculateTotalMoney();
      },
      error: (error) => {
        debugger;
        console.log(error);
      },
    });
  }
  calculateTotalMoney() {
    this.totalMoney = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }
}
