import { DataSource } from 'typeorm';
import { Customer } from '../modules/customers/entities/customer.entity';
import 'dotenv/config';
import path from 'path';
// For TypeORM CLI: direct export
export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Customer],
  // migrations: [__dirname + '/migrations/*.{ts,js}'],
  migrations: [path.join(process.cwd(), 'migrations/*.{ts,js}')],
  synchronize: true, // ✅ never true in production
  logging: true,
  extra: {
    max: 20, // connection pool
    idleTimeoutMillis: 30000,
  },
});

// For NestJS app usage (optional, keep if used elsewhere)
// export const createDataSource = (configService: any) =>
//   new DataSource({
//     type: 'postgres',
//     host: configService.get('database.host') as string,
//     port: configService.get('database.port') as number,
//     username: configService.get('database.user') as string,
//     password: configService.get('database.password') as string,
//     database: configService.get('database.name') as string,
//     entities: [Customer],
//     migrations: [__dirname + '/migrations/*.{ts,js}'],
//     synchronize: false,
//     logging: true,
//     extra: {
//       max: 20,
//       idleTimeoutMillis: 30000,
//     },
//   });
