import './tracing'; 
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: 'service_a_queue',
      queueOptions: { durable: true },
      noAck: true,
    },
  });

  await app.startAllMicroservices();
  
  await app.listen(3001);
}
bootstrap();
