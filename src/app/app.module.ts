// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { BrowserModule } from '@angular/platform-browser';
// import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { HomeComponent } from './component/home/home.component';
// import { AppRoutingModule } from './app.routes';
// import { HeaderComponent } from './component/header/header.component';
// import { FooterComponent } from './component/footer/footer.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './component/home/home.component';
import { AppRoutingModule } from './app.routes';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { RegisterComponent } from './component/register/register.component';
import { LoginComponent } from './component/login/login.component';
import { CartComponent } from './component/cart/cart.component';
import { CartDetailComponent } from './component/cart-detail/cart-detail.component';
import { ProductComponent } from './component/product/product.component';
import { ProductDetailsComponent } from './component/product-details/product-details.component';
import { BlogComponent } from './component/blog/blog.component';
import { ContactComponent } from './component/contact/contact.component';
import { RouterOutlet } from '@angular/router';
import { AppComponent } from './app.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  declarations: [
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    FooterComponent,
    HeaderComponent,
    CartComponent,
    CartDetailComponent,
    ProductComponent,
    ProductDetailsComponent,
    BlogComponent,
    ContactComponent,
    AppComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [
    // ProductDetailsComponent,
    // RegisterComponent,
    // LoginComponent,
    HomeComponent,
    // AppComponent,
    // OrderComponent,
    // ProductComponent,
    // OrderDetailComponent,
    // CartDetailComponent,
  ],
})
export class AppModule {}
