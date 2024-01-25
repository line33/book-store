import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { Category } from '../models/category.model';
import { Publishers } from '../models/publisher.model';

export class BorrowBookResponse {
  @ApiProperty({ type: ObjectId })
  id: ObjectId;

  @ApiProperty({ type: String })
  bookName: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: Category })
  category: Category;

  @ApiProperty({ type: Publishers })
  publisher: Publishers;

  @ApiProperty({ type: Boolean })
  borrowed: boolean;
}
