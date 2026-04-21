import { Inject, Injectable, NotFoundException } from '@nestjs/common';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable()
export class UserService {
  constructor(@Inject('DATABASE_CONNECTION') private readonly database: any) {
    console.log(this.database, '<==== this.database');
  }
  private users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
    },
  ];
  findAll(): User[] {
    return this.users;
  }
  findById(id: number): User {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
  create(user: Omit<User, 'id'>): User {
    const newUser: User = {
      ...user,
      id: this.users.length + 1,
    };
    this.users.push(newUser);
    return newUser;
  }
  update(id: number, userData: Partial<Omit<User, 'id'>>): User {
    const user = this.findById(id);
    Object.assign(user, userData);
    return user;
  }
  remove(id: number): boolean {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      // throw new NotFoundException(`User with id ${id} not found`);
      return false;
    }
    this.users.splice(index, 1);
    return true;
  }
}
