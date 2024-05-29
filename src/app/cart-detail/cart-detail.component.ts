import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-cart-detail',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './cart-detail.component.html',
  styleUrl: './cart-detail.component.scss',
})
export class CartDetailComponent {}
