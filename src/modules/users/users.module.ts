import { Module, forwardRef } from '@nestjs/common';
import { MongoConnectionService } from 'src/modules/mongo-connection/mongo-connection.service';
import { UsersController } from 'src/modules/users/users.controller';
import { UsersService } from 'src/modules/users/users.service';
import { RolesModule } from 'src/modules/roles/roles.module';
import { UserInterface } from 'src/modules/users/interfaces/user.interface';
import { User, UserSchema } from 'src/modules/users/schemas/user.schema';

@Module({
  imports: [forwardRef(() => RolesModule)],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'USER_MODEL',
      useFactory: (db: MongoConnectionService) =>
        db.getConnection().model<UserInterface>(User.name, UserSchema, 'users'),
      // (db name, schema name, collection name)
      inject: [MongoConnectionService],
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
