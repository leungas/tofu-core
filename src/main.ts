import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

/**
 * @method bootstrap
 * @description the main startup function
 * @author Mark Leung <leungas@gmail.com>
 */
async function bootstrap() {
  // loading the application
  const app = await NestFactory.create(AppModule);

  // loading config set
  const config = app.get(ConfigService);
  const env = config.get('app.env');

  // enforcing pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      skipMissingProperties: true,
      // forbidUnknownValues: true,
    }),
  );

  // loading the swagger component
  if (env === 'local' || env === 'debug') {
    const swagger = new DocumentBuilder()
      .setTitle('TOFU Workspace Core')
      .setDescription('The service managing tenant projects')
      .setVersion('0.1.0')
      .build();
    const docs = SwaggerModule.createDocument(app, swagger);
    SwaggerModule.setup(config.get('app.swagger.path'), app, docs);
  }

  // starting the HTTP server
  await app.listen(config.get('app.port'));
}

// this is our main
bootstrap();
