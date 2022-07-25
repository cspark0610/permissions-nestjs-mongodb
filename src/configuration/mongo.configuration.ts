import { registerAs } from '@nestjs/config';
//registerAs genera un objeto de configuración el cual va a ser exportado para que lo consuma en ConfigModule.forRoot()

export default registerAs('mongo', () => ({
  host: process.env.HOST_MONGODB,
  port: Number(process.env.PORT_MONGODB),
  user: process.env.USER_MONGODB,
  password: process.env.PASSWORD_MONGODB,
  database: process.env.DATABASE_MONGODB,
}));
