import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';

import { AuthId } from '../../decorators';
import { IUser } from './dto';
import { SetUserPhotoDto } from './dto';
import { SingleFile } from '../../decorators';
import { UpdateUserDto } from './dto';
import { User } from './schemas/user-schema';
import { UserFilterQueryDto } from './dto';
import { UserRole } from '../../decorators';
import { UserRoleEnum } from '../../constants';
import { UserRoleGuard } from '../../guards';
import { UserService } from './user.service';
import { ValidatorMongoIdPipe } from '../../pipes/validator-mongo-id.pipe';
import { UserStatusGuard } from '../../guards';

@ApiTags('Users')
@UserRole(UserRoleEnum.ADMIN)
@Controller('users')
@UseGuards(UserRoleGuard, UserStatusGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [User] })
  @Get('')
  @ApiSecurity('access-key')
  async getAllUsers(): Promise<IUser[]> {
    return await this.userService.getUsers();
  }

  @ApiOperation({ summary: 'Get user by userId' })
  @ApiResponse({ status: 200, type: User })
  @Get('/:id')
  @ApiSecurity('access-key')
  getUser(@Param('id', ValidatorMongoIdPipe) id: string): Promise<IUser> {
    return this.userService.getUserById(id);
  }

  @ApiOperation({ summary: 'Update user by userId' })
  @ApiResponse({ status: 200, type: User })
  @UserRole(UserRoleEnum.USER)
  @Put('')
  @ApiSecurity('access-key')
  updateUser(
    @AuthId() authId: string,
    @Body() param: UpdateUserDto,
  ): Promise<IUser> {
    return this.userService.updateUserByProperty(authId, param);
  }

  @ApiOperation({ summary: 'Delete user by userId' })
  @ApiResponse({ status: 200, type: User })
  @Delete(':id')
  @ApiSecurity('access-key')
  deleteUser(
    @AuthId() authId: string,
    @Param('id', ValidatorMongoIdPipe) id: string,
  ): Promise<IUser> {
    return this.userService.removeUserById(id, authId);
  }

  @ApiOperation({ summary: 'Get users by filter' })
  @ApiResponse({ status: 200, type: [User] })
  @ApiSecurity('access-key')
  @Get('filter/query')
  getUsers(
    @AuthId() authId: string,
    @Query() query: UserFilterQueryDto,
  ): Promise<IUser[]> {
    return this.userService.getUsersByFilter(query);
  }

  @ApiOperation({ summary: 'Set  or change User photo' })
  @ApiResponse({ status: 200, type: User })
  @ApiSecurity('access-key')
  @SingleFile()
  @Post('photo')
  setPhoto(
    @AuthId() authId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() setUserPhotoDto: SetUserPhotoDto,
  ): Promise<any> {
    setUserPhotoDto.file = file.originalname;
    return this.userService.setUserPhoto(authId, file, setUserPhotoDto);
  }
}
