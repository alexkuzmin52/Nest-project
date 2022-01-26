import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';

import { ChangeUserRoleDto } from './dto/change-user-role.dto';
import { ChangeUserStatusDto } from './dto/change-user-status.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './dto/user.inetrface';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserType } from './schemas/user-schema';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserStatusEnum } from './constants/user-status-enum';
import { ChangeUserPasswordDto } from './dto/change-user-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserType>,
    private jwtService: JwtService,
    private configService: ConfigService,
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
    // if (userById.status === 'blocked') {
    //   throw new ForbiddenException(
    //     'Your account is blocked. Information by phone +380661111111',
    //   );
    // }
    return userById;
  }

  async createUser(userDto: CreateUserDto): Promise<IUser> {
    const newUser = new this.userModel(userDto);
    return await newUser.save();
  }

  async updateUserByProperty(
    token: string,
    property: UpdateUserDto,
  ): Promise<IUser> {
    const payload = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });
    const updatedUser = await this.userModel
      .findByIdAndUpdate(payload.id, property, { new: true })
      .select(['-password'])
      .exec();
    if (!updatedUser) {
      throw new NotFoundException('user not found');
    }
    return updatedUser;
  }
  async updateRoleByUserId(
    userID: string,
    property: ChangeUserRoleDto,
  ): Promise<IUser> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userID, property, { new: true })
      .select(['-password'])
      .exec();
    if (!updatedUser) {
      throw new NotFoundException('user not found');
    }
    return updatedUser;
  }

  async updateStatusByUserId(
    userID: string,
    property: ChangeUserStatusDto,
  ): Promise<IUser> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userID, property, { new: true })
      .select(['-password'])
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('user not found');
    }
    return updatedUser;
  }

  async removeUserById(id: string): Promise<IUser> {
    const deletedUser = await this.userModel
      .findByIdAndDelete(id)
      .select(['-password'])
      .exec();
    if (!deletedUser) {
      throw new NotFoundException('user not found');
    }
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
}
