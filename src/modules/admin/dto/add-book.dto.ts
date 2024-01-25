import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class AddBookDto {
  @ApiProperty({
    required: true,
    type: String,
    example: '65b18289d633f6e4f11ad056',
  })
  @IsMongoId()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    required: true,
    type: String,
    example: '65b18316d633f6e4f11ad05c',
  })
  @IsMongoId()
  @IsNotEmpty()
  publisherId: string;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  bookName: string;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  description: string;
}
