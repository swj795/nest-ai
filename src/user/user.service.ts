import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { User } from './schemas/user.schema';

// export interface User {
//   id: number;
//   name: string;
//   email: string;
// }

@Injectable()
export class UserService {
  // constructor(@Inject('DATABASE_CONNECTION') private readonly database: any) {
  //   console.log(this.database, '<==== this.database');
  // }
  // private users: User[] = [
  //   {
  //     id: 1,
  //     name: 'John Doe',
  //     email: 'john.doe@example.com',
  //   },
  // ];
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(CreateUserDto: User): Promise<User> {
    // const createdUser = new this.users(user);
    const user = new this.userModel(CreateUserDto);
    return user.save();
  }

  findAll(): Promise<User[]> {
    // return this.users;
    return this.userModel.find().exec();
  }
  async findById(id: string): Promise<User> {
    // const user = this.users.find((user) => user.id === id);
    // if (!user) {
    //   throw new NotFoundException(`User with id ${id} not found`);
    // }
    // return user;
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid user id: ${id}`);
    }

    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }
  // create(user: Omit<User, 'id'>): User {
  //   const newUser: User = {
  //     ...user,
  //     id: this.users.length + 1,
  //   };
  //   this.users.push(newUser);
  //   return newUser;
  // }
  // update(id: number, userData: Partial<Omit<User, 'id'>>): User {
  //   const user = this.findById(id);
  //   Object.assign(user, userData);
  //   return user;
  // }
  // remove(id: number): boolean {
  //   const index = this.users.findIndex((u) => u.id === id);
  //   if (index === -1) {
  //     // throw new NotFoundException(`User with id ${id} not found`);
  //     return false;
  //   }
  //   this.users.splice(index, 1);
  //   return true;
  // }

  async update(id: string, updateUserDto: any) {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async delete(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
