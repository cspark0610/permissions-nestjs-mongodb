import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdatePermissionDto {
  @ApiProperty({
    name: 'originalName',
    type: String,
    required: true,
    description: 'nombre del permiso a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  originalName: string;

  @ApiProperty({
    name: 'newName',
    type: String,
    required: true,
    description: 'nuevo nombre del permiso',
  })
  @IsString()
  @IsNotEmpty()
  newName: string;
}
