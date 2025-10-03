import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entites';
import { Logs } from 'src/logs/logs.entites';
// import { LoggerModule } from 'nestjs-pino';
// import { join } from 'path';
// import { ConfigModule } from '@nestjs/config';
@Module({
  // imports: [ConfigModule.forRoot({
  //   isGlobal: true, // Make ConfigModule global
  // })],
  imports: [
    TypeOrmModule.forFeature([User, Logs]),
    // LoggerModule.forRoot({
    //   pinoHttp: {
    //     transport:
    //       process.env.NODE_ENV === 'development'
    //         ? {
    //             level: 'info',
    //             target: 'pino-pretty',
    //             options: {
    //               colorize: true,
    //             },
    //           }
    //         : {
    //             target: 'pino-roll',
    //             options: {
    //               file: join('log', 'log.txt'),
    //               frequency: 'daily',
    //               size: '10m',
    //               mkdir: true,
    //             },
    //           },
    //   },
    // }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
