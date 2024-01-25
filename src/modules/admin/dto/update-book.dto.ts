import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class UpdateBookDto {
  @ApiProperty({
    required: false,
    type: String,
    example: '65b18289d633f6e4f11ad056',
  })
  @IsMongoId()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({
    required: false,
    type: String,
    example: '65b18316d633f6e4f11ad05c',
  })
  @IsMongoId()
  @IsOptional()
  publisherId?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  bookName: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  description: string;
}
