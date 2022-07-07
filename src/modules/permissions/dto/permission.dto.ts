import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PermissionDto {
  @ApiProperty({
    name: 'name',
    type: String,
    required: true,
    description: 'Nombre del permiso',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
