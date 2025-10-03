import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  signin(@Body() dto: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { username, password } = dto;
    return this.authService.signin(username, password);
  }

  @Post('/signup')
  signup(@Body() dto: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { username, password } = dto;
    return this.authService.signup(username, password);
  }
}
