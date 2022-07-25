import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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

import { AuthId, UserRole } from '../../decorators';
import {
  ChangeUserPasswordDto,
  ChangeUserRoleDto,
  ChangeUserStatusDto,
  IAuth,
  LoginDto,
  RegisterUserDto,
} from './dto';
import { RefreshTokenGuard, UserRoleGuard } from '../../guards';
import { UserRoleEnum } from '../../constants';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Create and register user' })
  @ApiCreatedResponse({
    type: Object,
    description: 'User registered successfully',
  })
  @ApiBadRequestResponse()
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<object> {
    return await this.authService.registerUser(registerUserDto);
  }

  @ApiOperation({ summary: 'User registration confirmation' })
  @ApiOkResponse({ type: Object })
  @ApiUnauthorizedResponse()
  @Get('confirm/:confirmToken')
  async confirm(@Param('confirmToken') confirmToken: string): Promise<object> {
    return await this.authService.confirmUser(confirmToken);
  }

  @ApiOperation({ summary: 'User refresh token' })
  @ApiOkResponse({ type: Object, description: 'tokens' })
  @ApiNotFoundResponse()
  @ApiSecurity('access-key')
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.USER, UserRoleEnum.MANAGER)
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refresh(@AuthId() authid: string): Promise<object> {
    return await this.authService.refreshUserTokens(authid);
  }

  @ApiOperation({ summary: 'User login' })
  @ApiOkResponse({ type: Object, description: 'tokens' })
  @ApiUnauthorizedResponse()
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<Partial<IAuth>> {
    return await this.authService.loginUser(loginDto);
  }

  @ApiOperation({ summary: 'User logout' })
  @ApiOkResponse({ type: Object, description: 'user logout' })
  @ApiUnauthorizedResponse()
  @ApiSecurity('access-key')
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.USER, UserRoleEnum.MANAGER)
  @UseGuards(UserRoleGuard)
  @Get('logout')
  async logout(@AuthId() authId: string): Promise<object> {
    return await this.authService.logoutUser(authId);
  }

  @ApiOperation({ summary: 'User forgot password' })
  @ApiOkResponse({ type: Object })
  @ApiUnauthorizedResponse()
  @ApiSecurity('access-key')
  @Get('forgot')
  async forgot(@Req() req): Promise<object> {
    return await this.authService.forgotPassword(req.headers.authorization);
  }

  @ApiOperation({ summary: 'User reset password' })
  @ApiOkResponse({ type: Object })
  @Get('reset/:token')
  async reset(@Param('token') token: string): Promise<object> {
    return await this.authService.resetPassword(token);
  }

  @ApiOperation({ summary: 'User change password' })
  @ApiOkResponse({ type: Object })
  @ApiSecurity('access-key')
  @UserRole(UserRoleEnum.ADMIN, UserRoleEnum.USER, UserRoleEnum.MANAGER)
  @UseGuards(UserRoleGuard)
  @Put('pass')
  async changePassword(
    @AuthId() userId: string,
    @Body() userPasswordDto: ChangeUserPasswordDto,
  ): Promise<object> {
    return await this.authService.changeUserPassword(userId, userPasswordDto);
  }

  @ApiOperation({ summary: 'User change status' })
  @ApiOkResponse({ type: Object })
  @ApiNotFoundResponse()
  @ApiSecurity('access-key')
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
  @ApiResponse({ type: Object })
  @ApiNotFoundResponse()
  @ApiSecurity('access-key')
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
