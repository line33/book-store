import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';

export class EnrollUserResponse {
  @ApiProperty({ type: ObjectId })
  id: ObjectId;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  email: string;
}
