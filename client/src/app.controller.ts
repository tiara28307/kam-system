import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Client({
      transport: Transport.KAFKA,
      options: {
          client: {
              clientId: 'kafkaSample',
              brokers: ['localhost:9092'],
          },
          consumer: {
              groupId: 'kyc-screening-service'
          }
      }
  })
  client: ClientKafka;

  async onModuleInit() {
      // Need to subscribe to topic
      this.client.subscribeToResponseOf('test-topic');
      await this.client.connect();
  }

  @Get('/hello')
  async getHello() {
      return this.client.send('test-topic', 'Hello Kafka');
  }
}
