import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { Router } from '@angular/router';
import { ProductService } from '../../service/product.service';
import { environtment } from '../../environments/environment';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 12;
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = '';
  selectedCategoryId: number = 0;

  constructor(private router: Router, private productService: ProductService) {
    this.selectedCategoryId = 2;
    this.keyword = '';
  }

  ngOnInit() {
    this.getProducts(
      this.keyword,
      this.selectedCategoryId,
      this.currentPage,
      this.itemsPerPage
    );
  }
  onPageChange(page: number) {
    debugger;
    this.currentPage = page;
    this.getProducts(
      this.keyword,
      this.selectedCategoryId,
      this.currentPage - 1,
      this.itemsPerPage
    );
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
}
