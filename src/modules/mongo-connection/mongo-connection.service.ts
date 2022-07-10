import { Injectable } from '@nestjs/common';
import { Connection, createConnection } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongoConnectionService {
  private dbConnection: Connection;

  constructor(private configService: ConfigService) {
    this.createConnectionDB();
  }

  async createConnectionDB() {
    const host = this.configService.get('mongo.host');
    const port = this.configService.get('mongo.port');
    const user = this.configService.get('mongo.user');
    const password = this.configService.get('mongo.password');
    const database = this.configService.get('mongo.database');

    const mongoDB_URI =
      user && password
        ? `mongodb://${user}:${password}@${host}:${port}/${database}`
        : `mongodb://${host}:${port}/${database}`;

    this.dbConnection = await createConnection(mongoDB_URI);
    this.dbConnection.once('open', () => {
      console.log('MongoDB is connected to database ' + database);
    });

    this.dbConnection.once('error', () => {
      console.log('Error connecting to database ' + database);
    });
  }

  getConnection(): Connection {
    return this.dbConnection;
  }
}
