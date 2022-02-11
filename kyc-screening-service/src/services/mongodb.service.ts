import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from 'src/models/customer.model';

@Injectable()
export class MongoDbService{
    constructor(
        @InjectModel('Customer') private readonly customerModel:Model<Customer>
    ){}

    async getCustomer() {
        return await this.customerModel.find();
    }
}