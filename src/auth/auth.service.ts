import { Injectable } from '@nestjs/common';
import { getUserQueryDto } from 'src/user/dto/get-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}
  async signin(username: string, password: string) {
    const res = await this.userService.findAll({
      username,
    } as getUserQueryDto);
    return res;
  }
  signup(username: string, password: string) {
    return username + password;
  }
}
