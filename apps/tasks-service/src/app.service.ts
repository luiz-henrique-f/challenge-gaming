import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private users = [
    {
      id: '123',
      name: 'Admin User'
    }
  ]

  getUserProfile(userId: string){
    return this.users.find(user => user.id === userId) || null; 
  }
}
