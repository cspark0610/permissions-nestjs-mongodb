import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration/configuration';
import { MongoConnectionModule } from './modules/mongo-connection/mongo-connection.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
require('dotenv').config();

@Module({
  imports: [
    MongoConnectionModule,
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: `./env/${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    PermissionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor() {
    // console.log(process.env.NODE_ENV, 'process.env.NODE_ENV');
    // console.log(configuration(), 'configuration');
  }
}
