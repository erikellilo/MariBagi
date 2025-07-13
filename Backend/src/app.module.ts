import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { BillSharesModule } from './bill-shares/bill-shares.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'newuser',
      password: 'newuser',
      database: 'postgres',
      entities: [],
      synchronize: true,
    }),
    UsersModule,
    BillSharesModule,
  ],
})
export class AppModule {}
``;
