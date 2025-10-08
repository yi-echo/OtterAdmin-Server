import { Injectable } from '@nestjs/common';
import { getUserQueryDto } from 'src/user/dto/get-user.dto';
import { User } from 'src/user/user.entites';
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
  async signup(username: string, password: string) {
    // return username + password;
    const res = await this.userService.create({
      username,
      password,
    } as User);
    return res; 
  }
}
