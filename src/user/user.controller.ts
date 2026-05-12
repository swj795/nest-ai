import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  NotFoundException,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  // UseFilters,
} from '@nestjs/common';
import { UserService } from './user.service';
import type { User } from './user.service';

import { CreateUserDto } from './dto/create-user.dto';

import { RoleGuard, Roles } from 'src/auth/roles.guard';

@Controller('user')
@UseGuards(RoleGuard)
// @UseFilters()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): User[] {
    return this.userService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number): User {
    if (id > 100) {
      throw new NotFoundException('User not found');
    }
    return this.userService.findById(id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): User {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: { name: string; eamil: string },
  ): User {
    const user = this.userService.update(id, updateUserDto);
    return user;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): void {
    const success = this.userService.remove(id);
    if (!success) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
