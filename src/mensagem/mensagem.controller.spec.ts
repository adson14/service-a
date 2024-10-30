import { Controller, Get } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AuthService } from 'src/auth/auth.service';

@Controller('mensagem')
export class MensagemController {
  private client: ClientProxy;

  constructor(private authService: AuthService) {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: { urls: ['amqp://localhost:5672'], queue: 'service_b_queue' },
    });
  }

  @Get('send')
  async sendMessage() {
    const token = await this.authService.generateToken({ userId: 1 });
    return this.client.send('message_b', { text: 'Hello from Service A', token });
  }
}