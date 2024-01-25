import { ApiProperty } from '@nestjs/swagger';
import { AvaliableBookResponse } from './avaliable-books.response';

export class RemovedBookResponse extends AvaliableBookResponse {
  @ApiProperty({ required: true, type: Boolean })
  isDeleted: boolean;
}
