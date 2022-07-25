import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/configuration/mongo.configuration';
import { MongoConnectionModule } from 'src/modules/mongo-connection/mongo-connection.module';
import { PermissionsModule } from 'src/modules/permissions/permissions.module';
import { RolesModule } from 'src/modules/roles/roles.module';

@Module({
  imports: [
    MongoConnectionModule,
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: `./env/${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    PermissionsModule,
    RolesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
