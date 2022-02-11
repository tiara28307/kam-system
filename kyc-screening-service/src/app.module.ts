import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { customerSchema } from './schemas/customer.schema';
import { MongoDbService } from './services/mongodb.service';
import { MongoDbController } from './controllers/mongodb.controller';

@Module({
  imports: [
      /* MongooseModule.forRoot(
          'mongodb+srv://dev:kamTNrdmCiNYr3Rm@dev-us-east1-kam.pjnqf.mongodb.net/kssDB?retryWrites=true&w=majority',
          {
              connectionName: 'kssDb'
          }
      ),
      MongooseModule.forFeature([
          {
              name: 'Customer',
              schema: customerSchema,
              collection: 'customers'
          },
      ], 'kssDb') */
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
