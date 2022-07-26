import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { User } from 'src/modules/users/schemas/user.schema';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super(userModel);
  }

  async countDocuments(): Promise<number> {
    return this.userModel.countDocuments();
  }

  async getUsersWithRoles(roleName: string): Promise<{ count: number }[]> {
    // vamos a hacer "leftjoins" del modelo user con el modelo role, operador $lookup
    // { from: <nombre de la colleccion a agregar>, localField: <propiedad del modelo al cual hacemos el aggregate>,
    // foreignField: <nombre del campo que debe coincidir>, as: 'role' }
    return this.userModel.aggregate([
      {
        $lookup: {
          from: 'roles',
          localField: 'role',
          foreignField: '_id',
          as: 'roles',
          // "as" es el alias para usar en el $match
        },
      },
      {
        $match: {
          'roles.name': roleName,
        },
      },
      {
        $count: 'count',
      },
      // CON EL COUNT lo formatea a [ { count: 2 } ]
    ]);
  }
}
