import { UserResponse } from '../responses/userResponse';
import { CommentImage } from './comment.image';
import { Product } from './product';

export interface Comment {
  id: number;
  user: UserResponse;
  content: string;
  rating: number;
  images: CommentImage[]; 
}
