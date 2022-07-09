import { forwardRef, Module } from '@nestjs/common';
import { RolesController } from 'src/modules/roles/roles.controller';
import { RolesService } from 'src/modules/roles/roles.service';
import { PermissionsModule } from 'src/modules/permissions/permissions.module';
import { MongoConnectionService } from 'src/modules/mongo-connection/mongo-connection.service';
import { RoleInterface } from 'src/modules/roles/interfaces/role.interface';
import { Role, RoleSchema } from 'src/modules/roles/schemas/role.schema';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [PermissionsModule, forwardRef(() => UsersModule)],
  controllers: [RolesController],
  providers: [
    RolesService,
    {
      provide: 'ROLE_MODEL',
      useFactory: (db: MongoConnectionService) =>
        db.getConnection().model<RoleInterface>(Role.name, RoleSchema, 'roles'),
      inject: [MongoConnectionService],
    },
  ],
  exports: [RolesService],
})
export class RolesModule {}
