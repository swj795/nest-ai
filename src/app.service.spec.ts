import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(() => {
    service = new AppService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getHello', () => {
    it('should return the welcome message', () => {
      expect(service.getHello()).toBe(
        'Hello World! welcome to NestJs ! welcome',
      );
    });
  });
});
