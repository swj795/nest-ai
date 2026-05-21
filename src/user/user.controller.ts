import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  // UseFilters,
} from '@nestjs/common';
import { UserService } from './user.service';
// import type { User } from './user.service';
import { User } from './schemas/user.schema';

import { CreateUserDto } from './dto/create-user.dto';

import { RoleGuard } from '../auth/roles.guard';

@Controller('user')
@UseGuards(RoleGuard)
// @UseFilters()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<User> {
    // if (id > 100) {
    //   throw new NotFoundException('User not found');
    // }
    return this.userService.findById(id);
  }

  @Post()
  create(@Body() createUserDto: any): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: { name: string; eamil: string },
  ): Promise<User | null> {
    const user = this.userService.update(id, updateUserDto);
    return user;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<User | null> {
    // const success =
    return this.userService.delete(id);
    // if (!success) {
    //   throw new NotFoundException(`User with id ${id} not found`);
    // }
  }
}
