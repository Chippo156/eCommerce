import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CartService } from '../../service/cart.service';
import { ProductService } from '../../service/product.service';
import { Product } from '../../models/product';
import { environtment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  constructor(
    private cartService: CartService,
    private productService: ProductService
  ) {}

  totalMoney: number = 0;
  cartItems: { product: Product; quantity: number }[] = [];
  ngOnInit() {
    debugger;
    this.cartService.getCart().forEach((quantity, productId) => {
      this.productService.getProductDetails(productId).subscribe({
        next: (product: Product) => {
          product.url = `${environtment.apiBaseUrl}/products/viewImages/${product.thumbnail}`;
          this.cartItems.push({ product, quantity });
        },
      });
    });
  }
 
}
