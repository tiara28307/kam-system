import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserRequest } from './create-user-request.dto';
import { CreateUserEvent } from './create-user.event';

@Injectable()
export class AppService {

    constructor(
        @Inject('KSS') private readonly kssClient: ClientProxy,
        @Inject('ATS') private readonly atsClient: ClientProxy
    ){}

    getHello(): string {
        return 'Hello World!';
    }

    createUser(createUserRequest: CreateUserRequest) {
        this.kssClient.emit(
            'user_created', 
            new CreateUserEvent(createUserRequest.email)
        );
        this.atsClient.emit(
            'user_created', 
            new CreateUserEvent(createUserRequest.email)
        );
    }
}
