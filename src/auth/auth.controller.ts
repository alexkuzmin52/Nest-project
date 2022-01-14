import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { User } from '../user/schemas/user-schema';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, type: String })
  @Post('register')
  register(@Body() createUserDto: CreateUserDto): Promise<string> {
    return this.authService.registerUser(createUserDto);
  }

  @ApiOperation({ summary: 'User registration confirmation' })
  @ApiResponse({ status: 201, type: String })
  @Get('confirm/:confirmToken')
  confirm(@Param('confirmToken') confirmToken: string): Promise<object> {
    return this.authService.confirmUser(confirmToken);
  }

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, type: String })
  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<object> {
    return this.authService.loginUser(loginDto);
  }
}
