import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
      ClientsModule.register([
          {
              // KYC SCREENING SERVICE
              name: 'KSS',
              transport: Transport.TCP,
              options: { port: 3002 }
          },
          {
              // AML TRANSACTION SERVICE
              name: 'ATS',
              transport: Transport.TCP,
              options: { port: 3001 }
          }
      ])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
