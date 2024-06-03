import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { ContactComponent } from './component/contact/contact.component';
import { ProductComponent } from './component/product/product.component';
import { ProductDetailsComponent } from './component/product-details/product-details.component';
import { CartDetailComponent } from './component/cart-detail/cart-detail.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './component/login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'products', component: ProductComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'cart', component: CartDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
