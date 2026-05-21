import { Module } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { InterviewController } from './interview.controller';
import { UserModule } from 'src/user/user.module';
import { EventService } from 'src/common/services/event.service';

@Module({
  imports: [UserModule],
  providers: [InterviewService, EventService],
  controllers: [InterviewController],
})
export class InterviewModule {}
