import { Module } from '@nestjs/common';
import { MongoConnectionModule } from 'src/modules/mongo-connection/mongo-connection.module';
import { PermissionsModule } from 'src/modules/permissions/permissions.module';
import { RolesModule } from 'src/modules/roles/roles.module';
import { ConfigModule } from 'src/modules/config/config.module';

@Module({
  imports: [
    MongoConnectionModule,
    PermissionsModule,
    RolesModule,
    ConfigModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
