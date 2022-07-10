import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { SystemService } from '../../domain/services/system.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [SystemService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "TOFU Workspace Core is up"', () => {
      expect(appController.healthcheck()).toBe('TOFU Workspace Core is up');
    });
  });
});
