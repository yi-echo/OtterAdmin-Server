import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.setGlobalPrefix('api/v1'); // 全局路由前缀
  await app.listen(process.env.PORT ?? 3000);
  if (module.hot) {
    module.hot.accept();
  }
}
void bootstrap();
