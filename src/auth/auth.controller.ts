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

import { AuthId } from '../decorators/auth-id.decorator';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { IAuth } from './dto/auth.interface';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';
import { UserRole } from '../decorators/user-role.decorator';
import { UserRoleEnum } from '../user/constants/user-role-enum';
import { UserRoleGuard } from '../guards/user-role.guard';

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
  refresh(@AuthId() authid: string): Promise<object> {
    return this.authService.refreshUserTokens(authid);
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
  logout(@AuthId() authId: string): Promise<any> {
    return this.authService.logoutUser(authId);
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
  @Put('reset/:token')
  reset(@Param('token') token: string): Promise<object> {
    return this.authService.resetPassword(token);
  }
}
