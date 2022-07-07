import { Module } from '@nestjs/common';
import { MongoConnectionService } from 'src/modules/mongo-connection/mongo-connection.service';

@Module({
  controllers: [],
  providers: [MongoConnectionService],
  exports: [MongoConnectionService],
})
export class MongoConnectionModule {}
