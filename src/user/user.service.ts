import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ActionEnum } from '../log/constants/action-enum';
import { ChangeUserPasswordDto } from './dto/change-user-password.dto';
import { ChangeUserRoleDto } from './dto/change-user-role.dto';
import { ChangeUserStatusDto } from './dto/change-user-status.dto';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './dto/user.interface';
import { JwtService } from '@nestjs/jwt';
import { LogService } from '../log/log.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserType } from './schemas/user-schema';
import { UserFilterDto } from './dto/user-filter.dto';
import { UserFilterQueryDto } from './dto/user-filter-query.dto';
import { UserStatusEnum } from './constants/user-status-enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserType>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private logService: LogService,
  ) {}

  async getUsers(): Promise<IUser[]> {
    return await this.userModel.find({}, { password: 0 }).exec();
  }

  async getUserById(userID: string): Promise<IUser> {
    const userById = await this.userModel
      .findById(userID, { password: 0 })
      .exec();
    if (!userById) {
      throw new NotFoundException('user not found');
    }
    return userById;
  }

  async createUser(userDto: CreateUserDto): Promise<IUser> {
    const newUser = new this.userModel(userDto);
    return await newUser.save();
  }

  async updateUserByProperty(
    authId: string,
    property: UpdateUserDto,
  ): Promise<IUser> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(authId, property, { new: true })
      .select(['-password'])
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('user not found');
    }

    await this.logService.createLog({
      event: ActionEnum.USER_UPDATE,
      userId: authId,
      data: property,
    });

    return updatedUser;
  }
  async updateRoleByUserId(
    userID: string,
    property: ChangeUserRoleDto,
    authId: string,
  ): Promise<IUser> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userID, property, { new: true })
      .select(['-password'])
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('user not found');
    }

    await this.logService.createLog({
      event: ActionEnum.USER_CHANGE_ROLE,
      userId: authId,
      data: { user: updatedUser._id, role: updatedUser.role },
    });

    return updatedUser;
  }

  async updateStatusByUserId(
    userID: string,
    property: ChangeUserStatusDto,
    authId: string,
  ): Promise<IUser> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userID, property, { new: true })
      .select(['-password'])
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('user not found');
    }

    await this.logService.createLog({
      event: ActionEnum.USER_CHANGE_STATUS,
      userId: authId,
      data: { user: updatedUser._id, status: updatedUser.status },
    });

    return updatedUser;
  }

  async removeUserById(id: string, authId: string): Promise<IUser> {
    const deletedUser = await this.userModel
      .findByIdAndDelete(id)
      .select(['-password'])
      .exec();
    if (!deletedUser) {
      throw new NotFoundException('user not found');
    }

    await this.logService.createLog({
      event: ActionEnum.USER_DELETED,
      userId: authId,
      data: { user: deletedUser._id },
    });

    return deletedUser;
  }

  async updateUserByParam(
    userID: string,
    param: Partial<IUser>,
  ): Promise<IUser> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userID, param, { new: true })
      .select(['-password'])
      .exec();
    if (!updatedUser) {
      throw new NotFoundException('user not found');
    }
    return updatedUser;
  }

  async findUserByParam(param: Partial<IUser>): Promise<IUser> {
    const userByConfirmToken = await this.userModel.findOne(param).exec();

    if (
      !userByConfirmToken ||
      userByConfirmToken.status !== UserStatusEnum.PENDING
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return userByConfirmToken;
  }

  async findUserByEmail(email: Partial<IUser>): Promise<IUser> {
    const userByEmail = await this.userModel.findOne(email).exec();

    if (userByEmail) {
      throw new BadRequestException(
        `User with this e-mail ${userByEmail.email} is already registered`,
      );
    }
    return userByEmail;
  }
  async findUserLoginByEmail(email: Partial<IUser>): Promise<IUser> {
    const userLoginByEmail = await this.userModel.findOne(email).exec();

    if (!userLoginByEmail) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return userLoginByEmail;
  }

  async changePassword(
    token: string,
    changeUserPasswordDto: ChangeUserPasswordDto,
  ): Promise<object> {
    const payload = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });

    const hashedPassword = await bcrypt.hash(
      changeUserPasswordDto.password,
      10,
    );

    await this.userModel
      .updateOne(
        { _id: payload.id },
        { password: hashedPassword },
        { new: true },
      )
      .exec();
    return { message: 'Passport successfully changed' };
  }

  async getUsersByFilter(query: UserFilterQueryDto): Promise<IUser[]> {
    console.log(query);
    const {
      sortingField,
      sortingDirection,
      ageMin,
      ageMax,
      limit,
      page,
      ...rest
    } = query;
    const age = { $gte: ageMin, $lte: ageMax };
    const skip = limit * (page - 1);
    const filter: UserFilterDto = { ...rest, age };

    return await this.userModel
      .find(filter, { password: 0 })
      .sort([[sortingField, sortingDirection]])
      .skip(skip)
      .limit(limit)
      .exec();
  }
}
