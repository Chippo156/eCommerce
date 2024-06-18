import { Product } from '../models/product';

export interface SoldProduct {
  product: Product;
  quantity: number;
}
