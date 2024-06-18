import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CartService } from '../../service/cart.service';
import { Product } from '../../models/product';
import { ProductService } from '../../service/product.service';
import { environtment } from '../../environments/environment';
import { OrderResponse } from '../../responses/orderResponse';
import { OrderDTO } from '../../dtos/orderDto';
import { OrderService } from '../../service/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from '../../service/token.service';
import { FormBuilder } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { UserResponse } from '../../responses/userResponse';
import { PaymentService } from '../../service/payment.service';
import { Window } from '@popperjs/core';
import { CouponService } from '../../service/coupon.service';
import { Size } from '../../models/sizes';

@Component({
  selector: 'app-cart-detail',
  templateUrl: './cart-detail.component.html',
  styleUrls: ['./cart-detail.component.scss'],
})
export class CartDetailComponent implements OnInit {
  @ViewChild('userNameRef') userNameRef!: ElementRef;
  @ViewChild('phoneNumberRef')
  phoneNumberRef!: ElementRef;
  @ViewChild('addressRef') addressRef!: ElementRef;
  orderId: number = 0;
  // @ViewChild('paymentRef') paymentRef!: ElementRef;
  cartItems: { product: Product; quantity: number }[] = [];
  couponCode: string = '';
  checkAddCoupon: boolean = false;
  totalMoney: number = 0;
  subTotal: number = 0;
  discount: number = 0;
  selectedPayment: string = 'Thanh toán khi nhận hàng';
  address: string[] = [];
  selectedAddress: string = '';
  userResponse: UserResponse =
    this.userService.getUserResponseFromLocalStorage()!;
  selectedTranport: string = '';
  checkPayment: boolean = false;
  createPayment: any = {};
  homeUrl = window.location.href;
  size!: Size;
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
    private route: ActivatedRoute,
    private tokenService: TokenService,
    private fb: FormBuilder,
    private userService: UserService,
    private paymentService: PaymentService,
    private couponService: CouponService
  ) {
    this.orderDTO.full_name = '';
    this.orderDTO.email = '';
    this.orderDTO.phone_number = '';
    this.orderDTO.address = '';
    this.orderDTO.note = '';
    this.orderDTO.order_status = 'Pending';
    this.orderDTO.total_money = 0;
    this.orderDTO.shipping_method = this.selectedTranport;
    this.orderDTO.payment_method = 'Cash';
    this.orderDTO.shipping_address = '';
    this.orderDTO.tracking_number = '';
    this.address.push('123 Main Dr');
    this.address.push('456 Maple Dr');
    this.address.push('789 Maple Dr');
  }
  ngOnInit(): void {
    debugger;
    window.scrollTo(0, 0);
    this.orderDTO.user_id = this.tokenService.getUserIdByToken();
    const cartSize = this.cartService.getCartSize();
    const cart = this.cartService.getCart();
    let productIds = Array.from(cart.keys());
    if (productIds.length === 0) {
      return;
    }
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
  onChangeShippingAddress() {
    debugger;
    this.addressRef.nativeElement.textContent = this.selectedAddress;
  }
  placeOrder(): void {
    debugger;
    this.orderDTO.cart_items = this.cartItems.map((item) => {
      return { product_id: item.product.id, quantity: item.quantity };
    });
    this.orderDTO.full_name = this.userNameRef.nativeElement.textContent;
    this.orderDTO.phone_number = this.phoneNumberRef.nativeElement.textContent;
    this.orderDTO.address = this.addressRef.nativeElement.textContent;
    this.orderDTO.payment_method = this.selectedPayment;

    this.orderService.placeOrder(this.orderDTO).subscribe({
      next: (response) => {
        debugger;
        this.orderId = response.id;
        if (response.payment_method === 'Thanh toán qua thẻ') {
          alert('Bạn chắc chắn thanh toán qua thẻ');
        }
        if (response.payment_method === 'Thanh toán khi nhận hàng') {
          this.router.navigate(['/']);
          this.cartService.clearCart();
        } else {
          this.paymentService
            .getCreatePayment('NCB', this.totalMoney, this.orderId)
            .subscribe({
              next: (response) => {
                debugger;
                this.createPayment = response;
                if (this.createPayment?.code === 'ok') {
                  window.location.href = this.createPayment.paymentUrl;
                }
              },
              complete: () => {
                debugger;
                console.log(this.homeUrl);
                if (this.createPayment?.code === 'ok') {
                  debugger;
                  const url = new URLSearchParams(window.location.search);
                  console.log(url);
                  this.paymentService.getInfoPayment(url).subscribe({
                    next: (response: any) => {
                      debugger;
                      alert(response);
                      this.router.navigate(['']);
                    },
                    complete: () => {
                      debugger;
                      alert(response);
                    },
                    error: (error: any) => {
                      debugger;
                      console.log(
                        'Error fetching data payment method: ',
                        error
                      );
                    },
                  });
                }
              },
              error: (error) => {
                debugger;
                alert(`Lỗi khi tạo thanh toán ${error}`);
              },
            });
        }
        // this.router.navigate(['/']);
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
  CalculateCoupon() {
    if (this.checkAddCoupon === false) {
      this.checkAddCoupon = true;
      debugger;
      this.couponService.getCouponByCode(this.couponCode).subscribe({
        next: (response) => {
          debugger;
          if (response !== null) {
            this.discount = response.discount;
            this.totalMoney = this.totalMoney - response.discount;
          }
        },
        complete: () => {
          debugger;
        },
        error: (error) => {
          debugger;
          console.log('Error fetching data: ', error);
        },
      });
    }
  }
  extractCoupon() {
    this.checkAddCoupon = false;
    this.couponCode = '';
    this.totalMoney = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }
}
