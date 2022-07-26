import { Module } from '@nestjs/common';
import { MongoConnectionModule } from 'src/modules/mongo-connection/mongo-connection.module';
import { PermissionsModule } from 'src/modules/permissions/permissions.module';
import { RolesModule } from 'src/modules/roles/roles.module';
import { ConfigModule } from 'src/modules/config/config.module';

@Module({
  imports: [
    ConfigModule,
    MongoConnectionModule,
    PermissionsModule,
    RolesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
