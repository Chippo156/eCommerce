import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CartComponent } from '../cart/cart.component';
import { ActivatedRoute } from '@angular/router';
import { AppRoutingModule } from '../../app.routes';
import { CartService } from '../../service/cart.service';
import { HomeComponent } from '../home/home.component';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() keyword: string = '';
  @Output() searchEvent = new EventEmitter<string>();

  constructor() {}

  search() {
    this.searchEvent.emit(this.keyword);
  }
}
