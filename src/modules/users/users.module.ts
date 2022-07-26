import { Module, forwardRef } from '@nestjs/common';
//import { MongoConnectionService } from 'src/modules/mongo-connection/mongo-connection.service';
import { UsersController } from 'src/modules/users/users.controller';
import { UsersService } from 'src/modules/users/users.service';
import { RolesModule } from 'src/modules/roles/roles.module';
//import { UserInterface } from 'src/modules/users/interfaces/user.interface';
import { User, UserSchema } from 'src/modules/users/schemas/user.schema';
import { UsersRepository } from './users.repository';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => RolesModule),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    // {
    //   provide: 'USER_MODEL',
    //   useFactory: (db: MongoConnectionService) =>
    //     db.getConnection().model<UserInterface>(User.name, UserSchema, 'users'),
    //   // (db name, schema name, collection name)
    //   inject: [MongoConnectionService],
    // },
    UsersRepository,
  ],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}
