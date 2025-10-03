import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entites';
import { Logs } from 'src/logs/logs.entites';
import type { LogGroupResult } from 'src/types/log';
import { getUserQueryDto } from './dto/get-user.dto';
import { conditionUtils } from 'src/utils/db.helper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepostory: Repository<User>,
    @InjectRepository(Logs) private readonly logsRepostory: Repository<Logs>,
  ) {}

  findAll(query: getUserQueryDto) {
    const { limit, page, username, gender, role } = query;
    const take = limit || 10;
    const skip = (page || 1 - 1) * take;
    // return this.userRepostory.find({
    //   relations: {
    //     profile: true,
    //     roles: true,
    //   },
    //   where: {
    //     username,
    //     profile: {
    //       gender,
    //     },
    //     roles: {
    //       id: role,
    //     },
    //   },
    //   take,
    //   skip: (page - 1) * take,
    // });
    const obj = {
      'user.username': username,
      'profile.gender': gender,
      'roles.id': role,
    };
    // inner & left & outer
    const queryBuilder = this.userRepostory
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.roles', 'roles');

    // if (username) {
    //   queryBuilder.where('user.username = :username', { username });
    // } else {
    //   queryBuilder.where('user.username IS NOT NULL');
    // }
    const newQueryBuilder = conditionUtils<User>(queryBuilder, obj);
    // return this.userRepostory
    //   .createQueryBuilder('user')
    //   .leftJoinAndSelect('user.profile', 'profile')
    //   .leftJoinAndSelect('user.roles', 'roles')
    //   .where(username ? 'user.username = :username' : '1=1', { username })
    //   .andWhere(gender ? 'profile.gender = :gender' : '1=1', { gender })
    //   .andWhere(role ? 'roles.id = :role' : '1=1', { role })
    //   .limit(10)
    //   .getMany();
    // take(take).skip(skip)
    return newQueryBuilder.getMany();
  }

  find(username: string) {
    return this.userRepostory.findOne({ where: { username } });
  }

  findOne(id: number) {
    return this.userRepostory.findOne({ where: { id } });
  }

  async create(user: User) {
    const userTmp = this.userRepostory.create(user);
    try {
      const res = await this.userRepostory.save(userTmp);
      return res;
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null) {
        const err = error as {
          errno?: number;
          code?: string;
          message?: string;
        };
        if (err.errno === 1062 || err.code === 'ER_DUP_ENTRY') {
          throw new HttpException('Username already exists', 400);
        }
        throw new HttpException(err.message ?? 'Database error', 500);
      }
      throw new HttpException('Unknown error', 500);
    }
  }

  async update(id: number, user: Partial<User>) {
    const userTemp = await this.findUseProfile(id);
    const newUser = this.userRepostory.merge(userTemp!, user);
    return this.userRepostory.save(newUser);

    // return this.userRepostory.update(id, user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.userRepostory.remove(user!);
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
