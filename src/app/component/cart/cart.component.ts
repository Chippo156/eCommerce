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
import { Size } from '../../models/sizes';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  cartItems: { product: Product; quantity: number }[] = [];
  couponCode: string = '';
  totalMoney: number = 0;

  subTotal: number = 0;
  size!: Size;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}
  ngOnInit(): void {
    debugger;
    window.scrollTo(0, 0);
    const cart = this.cartService.getCart();
    const cartSize = this.cartService.getCartSize();
    const productIds = Array.from(cart.keys());
    this.productService.getProductByIds(productIds).subscribe({
      next: (products: any) => {
        debugger;
        this.cartItems = productIds.map((productId) => {
          debugger;
          const product = products.productResponses.find(
            (p: Product) => p.id === productId
          );
          if (product) {
            product.url = `${environtment.apiBaseUrl}/products/viewImages/${product.thumbnail}`;
            if (product.product_sale === null) {
              product.product_sale = {
                id: 0,
                description: '',
                sale: 0,
                newProduct: true,
                startDate: new Date(),
                endDate: new Date(),
              };

              // product.price =
              //   (product.price * (100 - product.product_sale.sale)) / 100;
            }
            let selectedSize = cartSize.get(productId);
            if (selectedSize) {
              this.size = product.sizes.find(
                (s: any) => s.size === selectedSize
              );
              product.price =
                ((product.price * (100 - product.product_sale.sale)) / 100) *
                (1 + this.size.priceSize / 100);
            }
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
  removeItem(productId: number) {
    this.cartService.removeProduct(productId);
    this.cartItems = this.cartItems.filter(
      (item) => item.product.id !== productId
    );
    this.calculateTotalMoney();
  }
  onChangeQuantity(productId: number, quantity: number) {
    if (quantity < 1) {
      quantity = 0;
      return;
    }
    this.cartService.updateQuantity(productId, quantity);
    this.cartItems = this.cartItems.map((item) => {
      if (item.product.id === productId) {
        item.quantity = quantity;
      }
      return item;
    });
    this.calculateTotalMoney();
  }
}
