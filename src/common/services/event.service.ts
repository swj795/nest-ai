import { Injectable } from '@nestjs/common';
import { Subject, Observable, interval } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class EventService {
  private eventSubject = new Subject<string>();

  emit(message: string) {
    this.eventSubject.next(message);
  }

  getEvent(): Observable<string> {
    return this.eventSubject.asObservable();
  }

  generateTimedMessages() {
    return interval(1000).pipe(
      map((count) => `这是第${count}条消息`),
      tap((message) => console.log(message, '推送消息')),
    );
  }
}
