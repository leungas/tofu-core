import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { SystemService } from '../../domain/services/system.service';
import { WorkspaceService } from '../../domain/services/workspace.service';
import { AccountModelRepository } from '../../infrastructure/repositories/account.repository';
import { WorkspaceModelRepository } from '../../infrastructure/repositories/workspace.repository';
import { EntityManager } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { WorkspaceCreateObject } from '../dto/workspace.create.dto';
import { WorkspaceUpdateObject } from '../dto/workspace.update.dto';
import { AccountModel } from '../../infrastructure/models/account.model.';
import { SystemTeamModel } from '../../infrastructure/models/system-team.model';

describe('AppController', () => {
  let controller: AppController;
  const mockEntityManager = {
    find: jest.fn().mockImplementation((type, filter) => {
      switch (type) {
        case AccountModel:
          return Promise.resolve([{ id: uuid() }]);
        case SystemTeamModel:
          return Promise.resolve([]);
        default:
          if (filter.where.name === 'test workspace (not repeat)')
            return Promise.resolve([]);
          else return Promise.resolve([{ id: uuid() }, { id: uuid() }]);
      }
    }),
    findOne: jest.fn().mockImplementation((type, filter) => {
      switch (type) {
        case AccountModel:
          return Promise.resolve({ id: uuid() });
        default:
          if (
            filter.where.account?.id === 'abcdefgh' ||
            filter.where.name === 'test workspace (not repeat)'
          )
            return Promise.resolve(undefined);
          else return Promise.resolve({ id: uuid() });
      }
    }),
    remove: jest
      .fn()
      .mockImplementation(() => Promise.resolve(undefined)),
    save: jest.fn().mockImplementation((entities) => {
      if (Array.isArray(entities)) {
        return Promise.resolve(
          (entities as any[]).map((i) => Object.assign(i, { id: uuid() })),
        );
      } else {
        return Promise.resolve(Object.assign(entities, { id: uuid() }));
      }
    }),
    transaction: jest.fn(async (fn) => fn(mockEntityManager)),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        SystemService,
        WorkspaceService,
        AccountModelRepository,
        WorkspaceModelRepository,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    controller = app.get<AppController>(AppController);
  });

  describe('Controllers', () => {
    it('should return "TOFU Workspace Core is up"', () => {
      expect(controller.healthcheck()).toBe('TOFU Workspace Core is up');
    });

    it('create()', async () => {
      const request: WorkspaceCreateObject = {
        admin: {
          id: uuid(),
          activated: true,
          enabled: true,
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@costono.com',
        },
        name: 'test workspace (not repeat)',
      };
      const result = await controller.create('abcdefgh', request);
      expect(result).toBeDefined();
    });

    it('get', async () => {
      expect(controller.get(uuid(), uuid())).resolves.toBeDefined();
    });

    it('remove', async () => {
      expect(controller.remove(uuid(), uuid())).resolves.toBeUndefined();
    });

    it('update()', async () => {
      const request: WorkspaceUpdateObject = {
        name: 'some newer name',
      };
      expect(controller.update(uuid(), uuid(), request)).resolves.toBeDefined();
    });
  });
});
