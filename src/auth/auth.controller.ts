import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { UserRole } from '../decorators/user-role.decorator';
import { UserRoleEnum } from '../user/constants/user-role-enum';
import { UserRoleGuard } from '../guards/user-role.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @ApiOperation({ summary: 'Create and register user' })
  @ApiResponse({ status: 201, type: String })
  @Post('register')
  register(@Body() createUserDto: CreateUserDto): Promise<string> {
    return this.authService.registerUser(createUserDto);
  }

  @ApiOperation({ summary: 'User registration confirmation' })
  @ApiResponse({ status: 200, type: String })
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

  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200 })
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.USER)
  @UseGuards(UserRoleGuard)
  @Get('logout/:token')
  logout(@Param('token') token: string): Promise<any> {
    return this.authService.logoutUser(token);
  }
}
