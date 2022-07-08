import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { RoleDto } from 'src/modules/roles/dto/role.dto';

export class UserDto {
  @ApiProperty({
    name: 'name',
    type: String,
    required: true,
    description: 'Nombre del usuario',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    name: 'name',
    type: String,
    required: true,
    description: 'Email del usuario',
  })
  @IsString()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    name: 'name',
    type: Date,
    required: true,
    description: 'Fecha de nacimiento del usuario',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  birthday!: Date;

  @ApiProperty({
    name: 'role',
    type: RoleDto,
    required: false,
    description: 'Role del usuario',
  })
  @Type(() => RoleDto)
  @IsObject()
  @IsOptional()
  role?: RoleDto;
}
