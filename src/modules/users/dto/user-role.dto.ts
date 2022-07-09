import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUppercase,
} from 'class-validator';

export class UserRoleDto {
  @ApiProperty({
    name: 'userCode',
    type: Number,
    required: true,
    description: 'Codigo del usuario al cual se le va a agregar un rol',
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  userCode: number;

  @ApiProperty({
    name: 'roleName',
    type: String,
    required: true,
    description: 'noimbre del rol a agregar al usuario, agregado en mayusculas',
  })
  @IsString()
  @IsUppercase()
  @IsNotEmpty()
  roleName: string;
}
