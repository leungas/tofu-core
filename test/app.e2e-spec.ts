import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let workspace: string;
  let team: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('TOFU Workspace Core is up');
  });

  it('/workspace (POST)', () => {
    return request(app.getHttpServer())
      .post('')
      .send({})
      .expect(201)
      .expect((response) => {
        const data = response.body;
        workspace = Reflect.get(data, 'id');
      });
  });

  it('/workspace (PUT)', () => {
    return request(app.getHttpServer())
      .put(`/workspaces/${workspace}`)
      .send({ name: 'Some newer name'})
      .expect(202)
      .expect((response) => {
        const data = response.body;
        return Reflect.get(data, 'name') === 'Some newer name';
      })
  });

  it('/workspace (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/workspaces/${workspace}`)
      .expect(201)
      .expect((response) => {
        const data = response.body;
        return data;
      });
  });  
});
