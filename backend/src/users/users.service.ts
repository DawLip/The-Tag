import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
      {
        id: 1,
        username: 'john',
        password: 'changeme',
      },
      {
        id: 2,
        username: 'mark',
        password: 'zuru',
      },
      {
        id: 3,
        username: 'bob',
        password: 'changeme',
      },
    ];
  
  
    async findOneById(id: number): Promise<User | undefined> {
      return this.users.find(user => user.id === id);
    }
    async findOne(username: string): Promise<User | undefined> {
      return this.users.find(user => user.username === username);
    }
}
