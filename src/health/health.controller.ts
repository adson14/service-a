import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, TypeOrmHealthIndicator, HealthCheck,HealthIndicator,HealthIndicatorResult} from '@nestjs/terminus';
import { connect, AmqpConnectionManager } from 'amqp-connection-manager';


@Controller('healthz')
export class HealthController {

  private rabbitMQHealthIndicator = new RabbitMQHealthIndicator();

  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator, 
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      async () => this.db.pingCheck('database'), // verifica a conexão com o banco de dados
      async () => this.rabbitMQHealthIndicator.isHealthy('rabbitmq'), // verifica a conexão com o RabbitMQ
    ]);
  }
}

class RabbitMQHealthIndicator extends HealthIndicator {
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      // Conecta ao RabbitMQ usando amqp-connection-manager
      const connection: AmqpConnectionManager = connect(['amqp://rabbitmq']);
      await new Promise((resolve, reject) => {
        connection.once('connect', () => resolve('Connected'));
        connection.once('disconnect', (err) => reject(err));
      });
      connection.close(); // Fecha a conexão após o teste
      return this.getStatus(key, true);
    } catch (error) {
      return this.getStatus(key, false, { message: error.message });
    }
  }
}