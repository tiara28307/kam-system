import { Controller, Get } from "@nestjs/common";
import { MongoDbService } from "src/services/mongodb.service";

@Controller('mongodb')
export class MongoDbController{
    constructor(private mongoDbService:MongoDbService){}

    @Get('/get')
    async get() {
        return {Customers: await this.mongoDbService.getCustomer}
    }
}