import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterOptionsDto {
  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  publisher?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  category?: string;
}
