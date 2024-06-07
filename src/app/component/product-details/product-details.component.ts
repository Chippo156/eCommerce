import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ProductService } from '../../service/product.service';
import { Product } from '../../models/product';
import { ProductImage } from '../../models/product.image';
import { environtment } from '../../environments/environment';
import { Category } from '../../models/category';
import { CartService } from '../../service/cart.service';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-product-details',

  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: ActivatedRoute
  ) {}

  productShowMore: Product[] = [];
  checkShowMore: boolean = false;
  product?: Product;
  productId: number = 1;
  currentImageIndex: number = 0;
  quantity: number = 1;
  quantityChange = new EventEmitter<number>();
  products: Product[] = [];
  categories: Category[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 6;
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = '';
  selectedCategoryId: number = 0;
  ngOnInit() {
    debugger;

    const idParam = this.router.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.productId = +idParam;
    }
    if (!isNaN(this.productId)) {
      this.productService.getProductDetails(this.productId).subscribe({
        next: (response: any) => {
          debugger;
          if (response.product_images && response.product_images.length > 0) {
            response.product_images.forEach((product_images: ProductImage) => {
              product_images.image_url = `${environtment.apiBaseUrl}/products/viewImages/${product_images.image_url}`;
            });
            if (response.product_sale === null) {
              response.product_sale = {
                id: 0,
                description: '',
                sale: 0,
                newProduct: true,
                startDate: new Date(),
                endDate: new Date(),
              };
            }
          }
          debugger;
          this.product = response;
          this.showImage(0);
        },
        complete: () => {
          debugger;
        },
        error: (error) => {
          debugger;
          console.log(error);
        },
      });
    } else {
      console.log('Product ID is not a number', idParam);
    }
    this.getProducts(
      this.keyword,
      this.selectedCategoryId,
      this.currentPage,
      this.itemsPerPage
    );
  }
  showImage(index: number) {
    debugger;
    if (
      this.product &&
      this.product.product_images &&
      this.product.product_images.length > 0
    ) {
      if (index < 0) {
        this.currentImageIndex = 0;
      } else if (index >= this.product.product_images.length) {
        this.currentImageIndex = this.product.product_images.length - 1;
      } else {
        this.currentImageIndex = index;
      }
    }
  }
  nextImage() {
    debugger;
    this.showImage(this.currentImageIndex + 1);
  }
  priviousImage() {
    debugger;
    this.showImage(this.currentImageIndex - 1);
  }
  thumbnailClick(index: number) {
    debugger;
    this.showImage(index);
  }
  increaseQuantity() {
    debugger;
    this.quantity++;
  }
  decreaseQuantity() {
    debugger;
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  getProducts(
    keyword: string,
    selectedCategoryId: number,
    page: number,
    limit: number
  ) {
    this.productService
      .getProducts(keyword, selectedCategoryId, page, limit)
      .subscribe({
        next: (response: any) => {
          debugger;
          response.productResponses.forEach((product: Product) => {
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
          });
          this.products = response.productResponses;
          this.totalPages = response.totalPage;
        },
        complete: () => {
          debugger;
        },
        error: (error) => {
          debugger;
          console.log(error);
        },
      });
  }

  addToCart() {
    debugger;
    if (this.product) {
      this.cartService.addToCart(this.productId, this.quantity);
    } else {
      console.log('Cannot add cart because product is not available');
    }
  }
  checkShowMoreProducts() {
    this.currentPage++;
    this.getProducts(
      this.keyword,
      this.selectedCategoryId,
      this.currentPage,
      this.itemsPerPage
    );
    this.productShowMore = this.products;
    this.checkShowMore = true;
  }

  buyNow() {}
}
