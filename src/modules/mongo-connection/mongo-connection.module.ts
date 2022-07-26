import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const NODE_ENV = configService.get('NODE_ENV');
        const host = configService.get('mongo.host');
        const port = configService.get('mongo.port');
        const user = configService.get('mongo.user');
        const password = configService.get('mongo.password');
        const database = configService.get('mongo.database');
        const mongoDB_URI =
          user && password
            ? `mongodb://${user}:${password}@${host}:${port}/${database}`
            : `mongodb://${host}:${port}/${database}`;
        const mongoDB_URI_TEST =
          configService.get<string>('MONGODB_URI_TEST') +
          configService.get<string>('DATABASE_MONGODB');

        console.log(
          `Connecting to MongoDB URI: ${
            NODE_ENV === 'test' ? mongoDB_URI_TEST : mongoDB_URI
          }`,
        );
        return {
          uri: NODE_ENV === 'test' ? mongoDB_URI_TEST : mongoDB_URI,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };
      },
    }),
  ],
  //providers: [MongoConnectionService],
  //exports: [MongoConnectionService],
})
export class MongoConnectionModule {}
