import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const port = process.env.PORT || 4002;

  const config = new DocumentBuilder()
    .setTitle('permimssions nest-api')
    .setDescription('example api mongoDB-mongoose')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  fs.writeFileSync('./swagger-spec.json', JSON.stringify(document, null, 2));
  SwaggerModule.setup('swagger', app, document);

  app.setGlobalPrefix('api/v1');
  await app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
bootstrap();
