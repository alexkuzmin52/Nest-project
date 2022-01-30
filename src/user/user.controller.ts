import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';
import { User } from './schemas/user-schema';
import { IUser } from './dto/user.inetrface';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidatorMongoIdPipe } from './pipes/validator-mongo-id.pipe';
import { ChangeUserRoleDto } from './dto/change-user-role.dto';
import { ChangeUserStatusDto } from './dto/change-user-status.dto';
import { UserRole } from '../decorators/user-role.decorator';
import { UserRoleEnum } from './constants/user-role-enum';
import { UserRoleGuard } from '../guards/user-role.guard';
import { ChangeUserPasswordDto } from './dto/change-user-password.dto';
import { Request } from 'express';
import { AuthId } from '../decorators/auth-id.decorator';

@ApiTags('Users CRUD')
@UserRole(UserRoleEnum.ADMIN)
@Controller('users')
@UseGuards(UserRoleGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [User] })
  @Get('')
  getAllUsers(): Promise<IUser[]> {
    return this.userService.getUsers();
  }

  @ApiOperation({ summary: 'Get user by userId' })
  @ApiResponse({ status: 200, type: User })
  @Get('/:id')
  getUser(@Param('id', ValidatorMongoIdPipe) id: string): Promise<IUser> {
    return this.userService.getUserById(id);
  }

  @ApiOperation({ summary: 'Update user by userId' })
  @ApiResponse({ status: 200, type: User })
  @UserRole(UserRoleEnum.USER)
  @Put('')
  updateUser(
    @AuthId() authId: string,
    @Body() param: UpdateUserDto,
  ): Promise<IUser> {
    return this.userService.updateUserByProperty(authId, param);
  }

  @ApiOperation({ summary: 'Change role of user by userId' })
  @ApiResponse({ status: 200, type: User })
  @Put('role/:id')
  changeUserRole(
    @AuthId() authId: string,
    @Param('id', ValidatorMongoIdPipe) id: string,
    @Body() param: ChangeUserRoleDto,
  ): Promise<IUser> {
    return this.userService.updateRoleByUserId(id, param, authId);
  }

  @ApiOperation({ summary: 'Change status of user by userId' })
  @ApiResponse({ status: 200, type: User })
  @Put('status/:id')
  changeUserStatus(
    @AuthId() authId: string,
    @Param('id', ValidatorMongoIdPipe) id: string,
    @Body() param: ChangeUserStatusDto,
  ): Promise<IUser> {
    return this.userService.updateStatusByUserId(id, param, authId);
  }

  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({ status: 200 })
  @UserRole(UserRoleEnum.USER)
  @Put('pass')
  changeUserPassword(
    @Req() req,
    @Body() changeUserPasswordDto: ChangeUserPasswordDto,
  ): Promise<object> {
    return this.userService.changePassword(
      req.headers.authorization,
      changeUserPasswordDto,
    );
  }

  @ApiOperation({ summary: 'Delete user by userId' })
  @ApiResponse({ status: 200, type: User })
  @Delete(':id')
  deleteUser(
    @AuthId() authId: string,
    @Param('id', ValidatorMongoIdPipe) id: string,
  ): Promise<IUser> {
    return this.userService.removeUserById(id, authId);
  }
}
