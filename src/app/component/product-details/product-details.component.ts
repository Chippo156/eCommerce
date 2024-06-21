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
import { SoldProduct } from '../../responses/SoldProduct';
import { OrderService } from '../../service/order.service';
import { CommmentService } from '../../service/comment.service';
import { Color } from '../../models/colors';
import { style } from '@angular/animations';
import { CommentImage } from '../../models/comment.image';
import { Comment } from '../../models/comment';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: ActivatedRoute,
    private route: Router,
    private orderService: OrderService,
    private commentService: CommmentService
  ) {}
  productShowMore: Product[] = [];
  productCheckColor: Product[] = [];
  checkShowMore: boolean = false;
  product!: Product;
  productId: number = 1;
  currentImageIndex: number = 0;
  quantity: number = 1;
  quantityChange = new EventEmitter<number>();
  products: Product[] = [];
  categories: Category[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 8;
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = '';
  selectedCategoryId: number = 0;
  soldQuantity: SoldProduct[] = [];
  listRating: Map<number, number> = new Map<number, number>();
  priceSize: number = 0;
  selectedSize: string = '';
  selectedColor: string = '';
  colors!: Color[];
  checkInfor: string = 'des';
  ngOnInit() {
    debugger;
    window.scrollTo(0, 0);
    this.getProductDetails(0);
    this.getProducts(
      this.keyword,
      this.selectedCategoryId,
      this.currentPage,
      this.itemsPerPage
    );
    this.getCountQuantityProduct();
  }
  getProductDetails(id: number) {
    debugger;
    const idParam = this.router.snapshot.paramMap.get('id');
    if (id !== 0) {
      this.productId = id;
    }
    if (idParam !== null && id === 0) {
      this.productId = parseInt(idParam!);
    }
    if (!isNaN(this.productId)) {
      this.productService.getProductDetails(this.productId).subscribe({
        next: (response: any) => {
          debugger;
          if (response.product_images && response.product_images.length > 0) {
            response.product_images.forEach((product_images: ProductImage) => {
              product_images.image_url = `${environtment.apiBaseUrl}/products/viewImages/${product_images.image_url}`;
            });
          }
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
          if (response.sizes.length <= 0) {
            response.sizes = [
              {
                id: 0,
                size: 'M',
                priceSize: 0,
              },
            ];
          }
          if (response.comments.length > 0) {
            response.comments.forEach((comment: Comment) => {
              comment.images.forEach((image: CommentImage) => {
                image.imageUrl = `${environtment.apiBaseUrl}/comments/viewImages/${image.imageUrl}`;
              });
            });
          }
          debugger;
          this.selectedSize = response.sizes[0].size;
          this.selectedColor = response.colors[0].code;
          this.product = response;
          this.showImage(0);
        },
        complete: () => {
          debugger;
          this.clickSize(this.selectedSize);
          this.getProductByCategory(this.product.category_id);
        },
        error: (error) => {
          debugger;
          console.log(error);
        },
      });
    } else {
      console.log('Product ID is not a number', idParam);
    }
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
            let flag = 0;
            product.product_images.forEach((product_images: ProductImage) => {
              if (flag === 1) {
                product.url = `${environtment.apiBaseUrl}/products/viewImages/${product_images.image_url}`;
              } else if (flag === 2) {
                return;
              }
              flag++;
            });
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

            let formattedNumber = product.price.toLocaleString('vi-VN');
            product.price = parseFloat(formattedNumber);
          });
          this.products = response.productResponses;
          this.totalPages = response.totalPage;
        },
        complete: () => {
          debugger;
          this.getRating();
          this.checkInforProduct(this.checkInfor);
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
      this.cartService.addToCart(
        this.productId,
        this.quantity,
        this.selectedSize
      );
    } else {
      console.log('Cannot add cart because product is not available');
    }
  }
  checkShowMoreProducts() {
    ++this.currentPage;
    this.getProducts(
      this.keyword,
      this.selectedCategoryId,
      this.currentPage,
      this.itemsPerPage
    );
    this.productShowMore = this.products;
    this.checkShowMore = true;
  }
  getProductDetail(productId: number) {
    this.route.navigate(['/products', productId]);
    setTimeout(() => {
      this.getProductDetails(0);
      window.scrollTo(0, 0);
    }, 10);
  }
  getRating() {
    this.products.forEach((product) => {
      let rating = 0;
      product.comments.forEach((comment) => {
        rating += comment.rating;
      });
      this.listRating.set(product.id, rating / product.comments.length);
    });
  }
  reviewRating(rating: number) {
    return Array(rating);
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
  clickSize(size: string) {
    debugger;
    this.selectedSize = size;
    this.priceSize = this.product.sizes.find((s) => s.size === size)!.priceSize;
  }
  clickColor(color: string) {
    debugger;
    this.selectedColor = color;
  }
  getProductByCategory(categoryId: number) {
    this.productService.getProductByCategoryId(categoryId).subscribe({
      next: (response: any) => {
        this.productCheckColor = response.productResponses;
        debugger;
      },
      complete: () => {
        this.getColors();
      },
      error: (error) => {
        debugger;
        console.log(error);
      },
    });
  }

  getColors() {
    debugger;
    this.colors = [];
    this.productCheckColor.forEach((product) => {
      product.colors.forEach((color) => {
        this.colors.push(color);
      });
    });
  }
  getProductByColor(selectedColor: string) {
    debugger;
    this.productCheckColor.forEach((product) => {
      product.colors.forEach((color) => {
        if (color.code === selectedColor) {
          this.getProductDetails(product.id);
        }
      });
    });
  }
  checkInforProduct(infor: string) {
    const element1 = document.getElementById('des');
    const element2 = document.getElementById('review');
    const element3 = document.getElementById('infor');

    if (infor === 'des') {
      this.checkInfor = 'des';
      element1?.classList.add('activeInfor');
      element2?.classList.remove('activeInfor');
      element3?.classList.remove('activeInfor');
    }
    if (infor === 'review') {
      this.checkInfor = 'review';
      element2?.classList.add('activeInfor');
      element1?.classList.remove('activeInfor');
      element3?.classList.remove('activeInfor');
    }
    if (infor === 'information') {
      this.checkInfor = 'information';
      element3?.classList.add('activeInfor');
      element1?.classList.remove('activeInfor');
      element2?.classList.remove('activeInfor');
    }
  }
  hoveredProductId: number | null = null;
  hoveredImage: string | null = null;

  hoverImageToImage(productId: number) {
    this.hoveredProductId = productId;
    this.getImageFromHover(productId);
  }
  hoverOutImage() {
    this.hoveredProductId = null;
    this.hoveredImage = null;
  }

  getImageFromHover(productId: number) {
    const product = this.products.find((product) => product.id === productId);
    const productShowMore = this.productShowMore.find(
      (product) => product.id === productId
    );
    if (product) {
      this.hoveredImage = `${environtment.apiBaseUrl}/products/viewImages/${product.thumbnail}`;
    }
    if (productShowMore) {
      this.hoveredImage = `${environtment.apiBaseUrl}/products/viewImages/${productShowMore.thumbnail}`;
    }
  }
}
