import { registerAs } from '@nestjs/config';
//registerAs genera un objeto de configuración el cual va a ser exportado para que lo consuma en ConfigModule.forRoot()

export default registerAs('mongo', () => ({
  host: process.env.HOST_MONGODB || 'localhost',
  port: Number(process.env.HOST_PORT) || 27017,
  user: process.env.HOST_USER || '',
  password: process.env.HOST_PASSWORD || '',
  database: process.env.HOST_DATABASE || 'permissions',
}));
