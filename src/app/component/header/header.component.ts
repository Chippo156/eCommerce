import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CartComponent } from '../cart/cart.component';
import { ActivatedRoute } from '@angular/router';
import { AppRoutingModule } from '../../app.routes';
import { CartService } from '../../service/cart.service';
@Component({
  selector: 'app-header',

  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(private cartService: CartService) {}

  
}
