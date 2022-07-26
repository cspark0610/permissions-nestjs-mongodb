import { forwardRef, Module } from '@nestjs/common';
import { RolesController } from 'src/modules/roles/roles.controller';
import { RolesService } from 'src/modules/roles/roles.service';
import { PermissionsModule } from 'src/modules/permissions/permissions.module';
//import { MongoConnectionService } from 'src/modules/mongo-connection/mongo-connection.service';
//import { RoleInterface } from 'src/modules/roles/interfaces/role.interface';
import { Role, RoleSchema } from 'src/modules/roles/schemas/role.schema';
import { UsersModule } from 'src/modules/users/users.module';
import { RolesRepository } from './roles.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersRepository } from '../users/users.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    PermissionsModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [RolesController],
  providers: [
    RolesService,
    // {
    //   provide: 'ROLE_MODEL',
    //   useFactory: (db: MongoConnectionService) =>
    //     db.getConnection().model<RoleInterface>(Role.name, RoleSchema, 'roles'),
    //   inject: [MongoConnectionService],
    // },
    RolesRepository,
    UsersRepository,
  ],
  exports: [RolesService, MongooseModule],
})
export class RolesModule {}
