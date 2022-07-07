import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoConnectionModule } from 'src/modules/mongo-connection/mongo-connection.module';
import configuration from 'src/configuration/configuration';
require('dotenv').config();

@Module({
  imports: [
    MongoConnectionModule,
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: `./env/${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor() {
    console.log(process.env.NODE_ENV, 'process.env.NODE_ENV');
    console.log(configuration(), 'configuration');
  }
}
