import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class BorrowBookDto {
  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsMongoId()
  bookId: string;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @ApiProperty({
    required: true,
    type: Number,
    examples: [1, 2, 3, 4, 5, 6, 7],
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  duration: number;
}
