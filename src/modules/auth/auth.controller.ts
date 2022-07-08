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

import { AuthId } from '../../decorators';
import { RegisterUserDto } from './dto';
import {
  ChangeUserPasswordDto,
  ChangeUserRoleDto,
  ChangeUserStatusDto,
  IAuth,
} from './dto';
import { LoginDto } from './dto';
import { RefreshTokenGuard } from '../../guards';
import { UserRole } from '../../decorators';
import { UserRoleEnum } from '../../constants';
import { UserRoleGuard } from '../../guards';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Create and register user' })
  @ApiResponse({ status: 201, type: String })
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<object> {
    return await this.authService.registerUser(registerUserDto);
  }

  @ApiOperation({ summary: 'User registration confirmation' })
  @ApiResponse({ status: 200, type: String })
  @Get('confirm/:confirmToken')
  async confirm(@Param('confirmToken') confirmToken: string): Promise<object> {
    return await this.authService.confirmUser(confirmToken);
  }

  @ApiOperation({ summary: 'User refresh token' })
  @ApiResponse({ status: 200, type: Object })
  @UserRole(UserRoleEnum.USER, UserRoleEnum.ADMIN)
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refresh(@AuthId() authid: string): Promise<object> {
    return await this.authService.refreshUserTokens(authid);
  }

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, type: String })
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<Partial<IAuth>> {
    return await this.authService.loginUser(loginDto);
  }

  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200 })
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.USER)
  @UseGuards(UserRoleGuard)
  @Get('logout')
  async logout(@AuthId() authId: string): Promise<any> {
    return await this.authService.logoutUser(authId);
  }

  @ApiOperation({ summary: 'User forgot password' })
  @ApiResponse({ status: 200 })
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.USER)
  @UseGuards(UserRoleGuard)
  @Get('forgot')
  async forgot(@Req() req): Promise<object> {
    return await this.authService.forgotPassword(req.headers.authorization);
  }

  @ApiOperation({ summary: 'User reset password' })
  @ApiResponse({ status: 200 })
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.USER)
  // @UseGuards(UserRoleGuard)
  @Get('reset/:token')
  async reset(@Param('token') token: string): Promise<object> {
    return await this.authService.resetPassword(token);
  }

  @ApiOperation({ summary: 'User change password' })
  @ApiResponse({ status: 200, type: Object })
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.USER)
  @UseGuards(UserRoleGuard)
  @Put('pass')
  async changePassword(
    @AuthId() userId: string,
    @Body() userPasswordDto: ChangeUserPasswordDto,
  ): Promise<object> {
    return await this.authService.changeUserPassword(userId, userPasswordDto);
  }

  @ApiOperation({ summary: 'User change status' })
  @ApiResponse({ status: 200, type: Object })
  @UserRole(UserRoleEnum.ADMIN)
  @UseGuards(UserRoleGuard)
  @Put('status/:id')
  async changeStatus(
    @AuthId() authId: string,
    @Param('id') id: string,
    @Body() userStatusDto: ChangeUserStatusDto,
  ): Promise<object> {
    return await this.authService.changeUserStatus(authId, id, userStatusDto);
  }

  @ApiOperation({ summary: 'User change role' })
  @ApiResponse({ status: 200, type: Object })
  @UserRole(UserRoleEnum.ADMIN)
  @UseGuards(UserRoleGuard)
  @Put('role/:id')
  async changeRole(
    @AuthId() authId: string,
    @Param('id') userId: string,
    @Body() userRoleDto: ChangeUserRoleDto,
  ): Promise<object> {
    return await this.authService.changeUserRole(authId, userId, userRoleDto);
  }
}
