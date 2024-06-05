import { ProductImage } from './product.image';
import { Sale } from './sale';

export interface Product {
  id: number;
  name: string;
  price: number;
  thumbnail: string;
  url: string;
  description: string;
  size: string;
  color: string;
  category_id: number;
  product_images: ProductImage[];
  product_sale: Sale;
}
