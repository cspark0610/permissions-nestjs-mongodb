import { Module } from '@nestjs/common';
import { PermissionsController } from 'src/modules/permissions/permissions.controller';
import { PermissionsService } from 'src/modules/permissions/permissions.service';
import { MongoConnectionService } from 'src/modules/mongo-connection/mongo-connection.service';
import { PermissionInterface } from 'src/modules/permissions/interfaces/permission.interface';
import {
  PermissionSchema,
  Permission,
} from 'src/modules/permissions/schemas/permission.schema';

@Module({
  imports: [],
  controllers: [PermissionsController],
  providers: [
    PermissionsService,
    /**
     * provide = Nombre del proveedor para el servicio
     * useFactory = Función a ejecutar
     * inject = Clases necesarias para useFactory
     * .model(DB name, schema Name, collection Name )
     */
    {
      provide: 'PERMISSION_MODEL',
      useFactory: (db: MongoConnectionService) =>
        db
          .getConnection()
          .model<PermissionInterface>(
            Permission.name,
            PermissionSchema,
            'permissions',
          ),
      inject: [MongoConnectionService],
    },
  ],
  exports: [PermissionsService],
})
export class PermissionsModule {}
