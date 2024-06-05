import { Component, Injectable, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Route, Router } from '@angular/router';
import { ProductService } from '../../service/product.service';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { environtment } from '../../environments/environment';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
@Injectable()
export class HomeComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 12;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = '';
  selectedCategoryId: number = 0;
  checkShowMore: boolean = false;

  constructor(private router: Router, private productService: ProductService) {
    this.selectedCategoryId = 2;
    this.keyword = '';
  }
  ngOnInit(): void {
    debugger;
    this.getProducts(
      this.keyword,
      this.selectedCategoryId,
      this.currentPage,
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
          this.totalPages = response.totalPages;
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
}
