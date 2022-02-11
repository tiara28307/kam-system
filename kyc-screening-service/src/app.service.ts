import { Injectable } from '@nestjs/common';
import { CreateUserEvent } from './create-user.event';

@Injectable()
export class AppService {
    private readonly users: any[] = [];

    getHello(): string {
        return 'Hello World!';
    }

    handleUserCreated(data: CreateUserEvent) {
        console.log('handleUserCreated - KSS', data);
        this.users.push({CreateUserEvent});
        // Actions after user is created here...
    }
}
