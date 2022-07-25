import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('permimssions nest-api')
  .setDescription('example api mongoDB-mongoose')
  .setVersion('1.0')
  .build();
