import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MensagemController } from './mensagem/mensagem.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.SECRET_JWT, // Substitua por uma chave secreta forte
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port:  Number(process.env.DB_PORT),
      username:  process.env.DB_USERNAME,
      password:  process.env.DB_PASSWORD,
      database:  process.env.DB_DATABASE,
      entities: [/* entidades aqui */],
      synchronize: true,
    }),
    HealthModule,
  ],
  controllers: [AppController,MensagemController],
  providers: [AppService,AuthService],
  exports:[AuthService]
})
export class AppModule {}
