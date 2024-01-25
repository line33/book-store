import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';

export class CategoryResponse {
  @ApiProperty({ type: ObjectId })
  id: ObjectId;

  @ApiProperty({ type: String })
  name: string;
}
