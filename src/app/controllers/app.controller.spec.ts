import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { SystemService } from '../../domain/services/system.service';
import { WorkspaceService } from '../../domain/services/workspace.service';
import { AccountModelRepository } from '../../infrastructure/repositories/account.repository';
import { WorkspaceModelRepository } from '../../infrastructure/repositories/workspace.repository';
import { EntityManager, FindManyOptions } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { WorkspaceCreateObject } from '../dto/workspace.create.dto';
import { WorkspaceUpdateObject } from '../dto/workspace.update.dto';
import { AccountModel } from '../../infrastructure/models/account.model.';
import { SystemTeamModel } from '../../infrastructure/models/system-team.model';
import { TeamService } from '../../domain/services/team.service';
import { TeamModelRepository } from '../../infrastructure/repositories/team.repository';
import { UserModelRepository } from '../../infrastructure/repositories/user.repository';
import { TeamModel } from '../../infrastructure/models/team.model';
import { WorkspaceModel } from '../../infrastructure/models/workspace.model';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('AppController', () => {
  let controller: AppController;
  const mockEntityManager = {
    find: jest
      .fn()
      .mockImplementation(async (type, filter: FindManyOptions) => {
        switch (type) {
          case AccountModel:
            return Promise.resolve([{ id: uuid() }]);
          case SystemTeamModel:
            const steamFilter = filter as FindManyOptions<SystemTeamModel>;
            const steamWhere = steamFilter?.where;
            if (Reflect.get(steamWhere ?? {}, 'id') === 1) {
              return Promise.resolve([{ id: 1 }]);
            } else {
              return Promise.resolve([]);
            }
          case TeamModel:
            const teamFilter = filter as FindManyOptions<TeamModel>;
            const teamWhere = teamFilter.where;
            if (Reflect.get(teamWhere, 'id') === 'abcdef') {
              return [{ id: 'abcdef' }];
            } else if (Reflect.get(teamWhere, 'owner')) {
              return [
                {
                  id: uuid(),
                  role: 'some roles',
                  owner: {
                    id: 'abcdef',
                    gender: 'unknown',
                    activated: true,
                    activatedOn: new Date().toISOString(),
                    createdOn: new Date().toISOString(),
                    email: 'john.smith@costono.com',
                    enabled: true,
                    firstName: 'John',
                    lastName: 'Smith',
                  },
                },
              ];
            } else {
              return Promise.resolve([]);
            }
          case WorkspaceModel:
            const workspaceFilter: FindManyOptions<WorkspaceModel> = filter;
            const workspaceWhere = workspaceFilter.where;
            if (
              Reflect.get(workspaceWhere, 'name') ===
              'test workspace (not repeat)'
            )
              return Promise.resolve([]);
            else if (Reflect.get(workspaceWhere, 'id') === 'abcdef') {
              return Promise.resolve([
                {
                  id: Reflect.get(workspaceWhere, 'id'),
                  account: {
                    id: uuid(),
                  },
                },
              ]);
            } else {
              return Promise.resolve([
                {
                  id: uuid(),
                },
                {
                  id: uuid(),
                },
              ]);
            }
        }
      }),
    findOne: jest.fn().mockImplementation((type, filter) => {
      switch (type) {
        case AccountModel:
          return Promise.resolve({ id: uuid() });
        case TeamModel:
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
    remove: jest.fn().mockImplementation(() => Promise.resolve(undefined)),
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
        EventEmitter2,
        SystemService,
        TeamService,
        WorkspaceService,
        AccountModelRepository,
        WorkspaceModelRepository,
        TeamModelRepository,
        UserModelRepository,
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
          profile: [],
        },
        name: 'test workspace (not repeat)',
      };
      const result = await controller.create('abcdefgh', request);
      expect(result).toBeDefined();
    });

    it('fetch()', async () => {
      const result = await controller.fetch('abcdef', 'abcdef');
      expect(result).toHaveLength(1);
    });

    it('get()', async () => {
      expect(controller.get(uuid(), uuid())).resolves.toBeDefined();
    });

    it('register()', async () => {
      const result = controller.register('acdefgh', 'abcdefgh', {
        code: 'TEST_TEAM',
        name: 'Test Team',
        members: [],
      });
      expect(result).toBeDefined();
    });

    it('remove()', async () => {
      expect(controller.remove(uuid(), uuid())).resolves.toBeUndefined();
    });

    it('search()', async () => {
      expect(
        controller.search('abcdef', {
          where: { id: 'abcdef' },
        }),
      ).resolves.toHaveLength(1);
    });

    it('update()', async () => {
      const request: WorkspaceUpdateObject = {
        name: 'some newer name',
      };
      expect(controller.update(uuid(), uuid(), request)).resolves.toBeDefined();
    });

    it('unregister()', async () => {
      expect(
        controller.unregister('abcdef', 'abcdef', 'abcdef'),
      ).toBeUndefined();
    });
  });
});
