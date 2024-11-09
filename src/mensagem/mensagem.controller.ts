import { Controller, Get } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AuthService } from 'src/auth.service';
import { trace, context } from '@opentelemetry/api';

@Controller('mensagem')
export class MensagemController {
  private client: ClientProxy;

  constructor(private authService: AuthService) {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: { urls: [process.env.RABBITMQ_URL], queue: 'service_b_queue' },
    });
  }

  @Get('send')
  async sendMessage() {
    const tracer = trace.getTracer('service-a');
    const token = await this.authService.generateToken({ userId: 1 });
  
    // Inicia um span para o envio de mensagem
    const span = tracer.startSpan('send_message_to_broker');
  
    // Adiciona o contexto do trace à mensagem
    const message = {
      text: 'Hello from Service A',
      token,
      traceId: span.spanContext().traceId,
      spanId: span.spanContext().spanId,
    };
  
    try {
      return context.with(trace.setSpan(context.active(), span), () => {
        return this.client.send('message_b', message).toPromise();
      });
    } catch (error) {
      span.recordException(error);
      console.error('Error in sendMessage:', error);
      throw error;
    } finally {
      span.end(); // Fecha o span
    }
  }
}
