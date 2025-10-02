import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule, {
    // logger: false,
    // logger: ['error', 'warn'],
  });
  app.setGlobalPrefix('api/v1'); // 全局路由前缀
  await app.listen(process.env.PORT ?? 3000);
  // app.use(new (AppModule as any).LoggerMiddleware().use);
  logger.log(`App running:3000`);
  if (module.hot) {
    module.hot.accept();
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
