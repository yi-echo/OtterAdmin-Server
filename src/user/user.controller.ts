import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entites';
import { LogGroupResult } from '../types/log';
import { Logger } from 'nestjs-pino';
import { getUserQueryDto } from './dto/get-user.dto';

@Controller('user')
export class UserController {
  // private logger = new Logger(UserController.name);
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private logger: Logger,
  ) {}

  @Get()
  getAllUser(@Query() query: getUserQueryDto): any {
    // this.logger.error('success!!!');
    return this.userService.findAll(query);
  }

  @Get('/:id')
  getUserById(@Body() id: number): any {
    return this.userService.findOne(id);
  }

  @Post()
  ceaterUser(@Body() dto: any) {
    const user = dto as User;
    return this.userService.create(user);
  }

  @Patch('/:id')
  updateUser(@Body() dto: any, @Param('id') id: number): any {
    const user = dto as User;
    return this.userService.update(id, user);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: number): any {
    return this.userService.remove(id);
  }

  @Get('/profile')
  getProfile(@Query('id') query: any): any {
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
