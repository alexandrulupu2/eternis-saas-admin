import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();

  // Configurare MVC (Model-View-Controller) pentru panoul Admin
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  await app.listen(3001);
  console.log('Backend NestJS Eternis ruleaza pe http://localhost:3001 (MVC Admin pe /admin + REST API pe /api)');
}
bootstrap();
