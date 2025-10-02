import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entites';
import { Logs } from 'src/logs/logs.entites';
import type { LogGroupResult } from 'src/types/log';
import { getUserQueryDto } from './dto/get-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepostory: Repository<User>,
    @InjectRepository(Logs) private readonly logsRepostory: Repository<Logs>,
  ) {}

  findAll(query: getUserQueryDto) {
    const { limit, page, username, gender, role } = query;
    const take = limit || 10;
    return this.userRepostory.find({
      relations: {
        profile: true,
        roles: true,
      },
      // where: {
      //   username,
      //   profile: {
      //     gender,
      //   },
      //   roles: {
      //     id: role,
      //   },
      // },
      take,
      skip: (page - 1) * take,
    });
  }

  find(username: string) {
    return this.userRepostory.findOne({ where: { username } });
  }

  findOne(id: number) {
    return this.userRepostory.findOne({ where: { id } });
  }

  async create(user: User) {
    const userTmp = this.userRepostory.create(user);
    return this.userRepostory.save(userTmp);
  }

  async update(id: number, user: Partial<User>) {
    return this.userRepostory.update(id, user);
  }

  remove(id: number) {
    return this.userRepostory.delete(id);
  }

  findUseProfile(id: number) {
    return this.userRepostory.findOne({
      where: {
        id,
      },
      relations: {
        profile: true,
      },
    });
  }

  async findUserLogs(id: number) {
    return this.logsRepostory.find({
      where: { user: { id } }, // 直接用 id 过滤
      relations: { user: true },
    });
  }

  findLogsByGroup(id: number) {
    return this.logsRepostory
      .createQueryBuilder('logs')
      .select('logs.result', 'result')
      .addSelect('COUNT("logs.result")', 'count')
      .leftJoinAndSelect('logs.user', 'user')
      .where('user.id = :id', { id })
      .groupBy('logs.result')
      .orderBy('result', 'DESC')
      .getRawMany<LogGroupResult>();
  }
}
