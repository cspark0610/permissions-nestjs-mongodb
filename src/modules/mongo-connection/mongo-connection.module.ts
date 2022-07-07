import { Global, Module } from '@nestjs/common';
import { MongoConnectionService } from 'src/modules/mongo-connection/mongo-connection.service';

@Global()
@Module({
  controllers: [],
  providers: [MongoConnectionService],
  exports: [MongoConnectionService],
})
export class MongoConnectionModule {}
