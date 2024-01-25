import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';

export class PublisherResponse {
  @ApiProperty({ type: ObjectId })
  id: ObjectId;

  @ApiProperty({ type: String })
  name: string;
}
