import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class InterviewService {
  constructor(private readonly userService: UserService) {}

  createInterview(userId: number) {
    const user = this.userService.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
  }
}
