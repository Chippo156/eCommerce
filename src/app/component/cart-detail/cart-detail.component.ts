import { Component, OnInit } from '@angular/core';
import { CartService } from '../../service/cart.service';
import { Product } from '../../models/product';
import { ProductService } from '../../service/product.service';
import { environtment } from '../../environments/environment';
import { OrderResponse } from '../../responses/orderResponse';
import { OrderDTO } from '../../dtos/orderDto';
import { OrderService } from '../../service/order.service';
import { Router } from '@angular/router';
import { TokenService } from '../../service/token.service';
import { FormBuilder } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { UserResponse } from '../../responses/userResponse';

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

  userResponse: UserResponse =
    this.userService.getUserResponseFromLocalStorage()!;

  selectedTranport: string = '';

  orderDTO: OrderDTO = {
    user_id: 1,
    full_name: '',
    email: '',
    phone_number: '',
    address: '',
    note: '',
    order_status: '',
    total_money: 0,
    shipping_method: '',
    payment_method: '',
    shipping_address: '',
    tracking_number: '',
    cart_items: [],
  };

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router,
    private tokenService: TokenService,
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.orderDTO.full_name = this.userResponse.full_name;
    this.orderDTO.email = '';
    this.orderDTO.phone_number = this.userResponse.phone_number;
    this.orderDTO.address = this.userResponse.address;
    this.orderDTO.note = '';
    this.orderDTO.order_status = 'Pending';
    this.orderDTO.total_money = 0;
    this.orderDTO.shipping_method = this.selectedTranport;
    this.orderDTO.payment_method = 'Cash';
    this.orderDTO.shipping_address = '';
    this.orderDTO.tracking_number = '';
  }
  ngOnInit(): void {
    debugger;
    this.orderDTO.user_id = this.tokenService.getUserIdByToken();

    const cart = this.cartService.getCart();
    let productIds = Array.from(cart.keys());
    if (productIds.length === 0) {
      return;
    }
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
  isCartEmpty(): boolean {
    if (this.cartItems.length === 0) {
      return false;
    }
    return true;
  }
  calculateTotalMoney() {
    this.totalMoney = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }
  onChangeTransport() {
    console.log(this.selectedTranport); // This will log the value of the selected radio button
  }
  placeOrder(): void {
    debugger;
    this.orderDTO.cart_items = this.cartItems.map((item) => {
      return { product_id: item.product.id, quantity: item.quantity };
    });
    this.orderService.placeOrder(this.orderDTO).subscribe({
      next: (response) => {
        debugger;
        this.router.navigate(['/']);
        this.cartService.clearCart();
        alert('Order successfully');
      },
      complete: () => {
        debugger;
        this.calculateTotalMoney();
      },
      error: (error) => {
        debugger;
        alert(`Lỗi khi đặt hàng ${error}`);
      },
    });
  }
}
