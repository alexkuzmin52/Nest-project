import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../decorators/user-role.decorator';
import { UserRoleEnum } from '../user/constants/user-role-enum';
import { UserRoleGuard } from '../guards/user-role.guard';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';
import { IAuth } from './dto/auth.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Create and register user' })
  @ApiResponse({ status: 201, type: String })
  @Post('register')
  register(@Body() createUserDto: CreateUserDto): Promise<object> {
    return this.authService.registerUser(createUserDto);
  }

  @ApiOperation({ summary: 'User registration confirmation' })
  @ApiResponse({ status: 200, type: String })
  @Get('confirm/:confirmToken')
  confirm(@Param('confirmToken') confirmToken: string): Promise<object> {
    return this.authService.confirmUser(confirmToken);
  }

  @ApiOperation({ summary: 'User refresh token' })
  @ApiResponse({ status: 200, type: Object })
  @UserRole(UserRoleEnum.USER, UserRoleEnum.ADMIN)
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refresh(@Req() req): Promise<object> {
    return this.authService.refreshUserTokens(req.headers.authorization);
  }

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, type: String })
  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<Partial<IAuth>> {
    return this.authService.loginUser(loginDto);
  }

  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200 })
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.USER)
  @UseGuards(UserRoleGuard)
  @Get('logout')
  logout(@Req() req): Promise<any> {
    return this.authService.logoutUser(req.headers.authorization);
  }

  @ApiOperation({ summary: 'User forgot password' })
  @ApiResponse({ status: 200 })
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.USER)
  @UseGuards(UserRoleGuard)
  @Get('forgot')
  forgot(@Req() req): Promise<object> {
    return this.authService.forgotPassword(req.headers.authorization);
  }

  @ApiOperation({ summary: 'User reset password' })
  @ApiResponse({ status: 200 })
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.USER)
  @UseGuards(UserRoleGuard)
  // @Put('reset/:token')
  @Put('reset/:token')
  reset(@Param('token') token: string): Promise<object> {
    return this.authService.resetPassword(token);
  }
}
