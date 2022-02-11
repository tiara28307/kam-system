import { Injectable } from '@nestjs/common';
import { CreateUserEvent } from './create-user.event';

@Injectable()
export class AppService {
    private readonly analytics: any[] = [];

    getHello(): string {
        return 'Hello World!';
    }

    handleUserCreated(data: CreateUserEvent) {
        console.log('handleUserCreated - ATS', data);
        this.analytics.push({
            email: data.email,
            timestamp: new Date()
        });
        console.log('Analytics timestamp: ', this.analytics);
    }
}
