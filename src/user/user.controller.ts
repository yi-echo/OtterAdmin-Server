import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entites';
import { LogGroupResult } from '../types/log';
import { Logger } from 'nestjs-pino';

@Controller('user')
export class UserController {
  // private logger = new Logger(UserController.name);
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private logger: Logger,
  ) {}

  @Get()
  getAllUser() {
    // this.logger.error('success!!!');
    return this.userService.findAll();
  }

  @Get('/:id')
  getUserById(): any {
    return '11';
  }

  @Post()
  ceaterUser(@Body() dto: any) {
    const user = {
      username: 'che2132133n',
      password: '12343321321356',
    } as User;
    return this.userService.create(user);
  }

  @Patch()
  updateUser(): any {
    const user = { username: 'newname' } as User;
    return this.userService.update(1, user);
  }

  @Delete()
  deleteUser(): any {
    return this.userService.remove(1);
  }

  @Get('/profile')
  getProfile(): any {
    return this.userService.findUseProfile(2);
  }

  @Get('/logs')
  getUserLogs(): any {
    return this.userService.findUserLogs(2);
  }

  @Get('/logsByGroup')
  async getLogsByGroup(): Promise<LogGroupResult[]> {
    const res = await this.userService.findLogsByGroup(2);
    return res.map((o) => ({
      result: o.result,
      count: o.count,
    }));
  }
}
