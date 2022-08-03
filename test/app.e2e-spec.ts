import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from '../src/infrastructure/config/configuration';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let account: string;
  let workspace: string;
  let team: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          ...configuration().datasource,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('TOFU Workspace Core is up');
  }, 500000);
});
