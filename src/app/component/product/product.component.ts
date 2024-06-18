import {
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { Router } from '@angular/router';
import { ProductService } from '../../service/product.service';
import { environtment } from '../../environments/environment';
import { CommmentService } from '../../service/comment.service';
import { OrderService } from '../../service/order.service';
import { SoldProduct } from '../../responses/SoldProduct';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  productsSort: Product[] = [];
  categories: Category[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 16;
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = '';
  selectedCategoryId: number = 0;
  soldQuantity: SoldProduct[] = [];
  listRating: Map<number, number> = new Map<number, number>();
  constructor(
    private router: Router,
    private productService: ProductService,
    private commentService: CommmentService,
    private orderService: OrderService
  ) {
    this.selectedCategoryId = 0;
    this.keyword = '';
  }

  ngOnInit() {
    debugger;
    window.scrollTo(0, 0);
    this.getProducts(
      this.keyword,
      this.selectedCategoryId,
      this.currentPage,
      this.itemsPerPage
    );
    this.getCountQuantityProduct();
  }
  onPageChange(page: number) {
    debugger;
    window.scrollTo(0, 0);
    this.currentPage = page;
    this.getProducts(
      this.keyword,
      this.selectedCategoryId,
      this.currentPage - 1,
      this.itemsPerPage
    );
    const element = document.getElementById('select') as HTMLSelectElement;
    element.value = '0';
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
          this.visiblePages = this.generateVisiblePages(
            this.currentPage,
            this.totalPages
          );
        },
        complete: () => {
          debugger;
          this.getRating();
        },
        error: (error) => {
          debugger;
          console.log(error);
        },
      });
  }
  generateVisiblePages(currentPage: number, totalPages: number): number[] {
    const maxVisiblePage = 5;
    const haftVisiblePage = Math.floor(maxVisiblePage / 2);
    let startPage = Math.max(currentPage - haftVisiblePage, 1);
    let endPage = Math.min(startPage + maxVisiblePage - 1, totalPages);
    if (endPage - startPage + 1 < maxVisiblePage) {
      startPage = Math.max(endPage - maxVisiblePage + 1, 1);
    }
    return new Array(endPage - startPage + 1)
      .fill(0)
      .map((_, index) => startPage + index);
  }
  getProductDetail(productId: number) {
    this.router.navigate(['/products', productId]);
  }
  onSortChange(event?: Event) {
    debugger;
    const selectElement = event!.target as HTMLSelectElement;
    const selectValue = selectElement.value;

    if (selectValue === '0') {
      this.getProducts(
        this.keyword,
        this.selectedCategoryId,
        this.currentPage,
        this.itemsPerPage
      );
    }
    if (selectValue === '1') {
      this.products = this.products.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }
    if (selectValue === '2') {
      this.products = this.products.sort((a, b) => a.price - b.price);
    }
    if (selectValue === '3') {
      this.products = this.products.sort((a, b) => b.price - a.price);
    }
    if (selectValue === '4') {
      debugger;
      this.products = this.products.filter((product) => {
        debugger;
        const today = new Date();
        const productDate = new Date(product.created_at);
        console.log(productDate);

        const diffInTime = today.getTime() - productDate.getTime();
        const diffInDays = diffInTime / (1000 * 3600 * 24);
        console.log(diffInDays);

        return diffInDays <= 10;
      });
    }
    if (selectValue === '5') {
      debugger;
      this.products = this.products.filter((product) => {
        debugger;
        const today = new Date();
        const productDate = new Date(product.created_at);
        console.log(productDate);

        const diffInTime = today.getTime() - productDate.getTime();
        const diffInDays = diffInTime / (1000 * 3600 * 24);
        console.log(diffInDays);

        return diffInDays > 10;
      });
    }
  }
  getRating() {
    this.products.forEach((product) => {
      let rating = 0;

      product.comments.forEach((comment) => {
        rating += comment.rating;
      });
      this.listRating.set(product.id, rating / product.comments.length);
      console.log(this.listRating);
    });
  }
  getRatingProductId(productId: number): any[] {
    const rating = this.listRating.get(productId) as number;

    if (isNaN(rating) || rating === undefined) {
      return Array(4);
    }
    return Array(Math.round(rating));
  }
  getCountQuantityProduct() {
    this.orderService.countQuantityProductInOrder().subscribe({
      next: (response: any) => {
        debugger;
        response.forEach((product: SoldProduct) => {
          this.soldQuantity.push(product);
        });
      },
      error: (error) => {
        debugger;
        console.log(error);
      },
    });
  }
  getSoldQuantity(productId: number): number {
    const product = this.soldQuantity.find(
      (product) => product.product.id === productId
    );
    if (product) {
      return product.quantity;
    }
    return 0;
  }
  formatQuantity(quantity: number): string {
    return quantity > 1000
      ? (quantity / 1000).toFixed(1) + 'k'
      : quantity.toString();
  }
}
