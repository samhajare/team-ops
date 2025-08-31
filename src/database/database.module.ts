import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Customer } from '../modules/customers/entities/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const db = configService.get('database');
        return {
          type: 'postgres',
          host: db.host,
          port: db.port,
          username: db.user,
          password: db.password,
          database: db.name,
          autoLoadEntities: true,
          entities: [Customer],
          synchronize: false,
          migrations: [__dirname + '/migrations/*.{ts,js}'],
          logging: false,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
