import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { MensagemController } from './mensagem/mensagem.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.SECRET_JWT, // Substitua por uma chave secreta forte
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AppController,MensagemController],
  providers: [AppService,AuthService],
  exports:[AuthService]
})
export class AppModule {}
