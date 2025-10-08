import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class SigninUsersDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  password: string;
}