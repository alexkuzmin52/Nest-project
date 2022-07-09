import * as fs from 'fs-extra';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';

import { ActionEnum } from '../../constants';
import { FileService } from '../file/file.service';
import { IFile } from '../file/dto';
import { IUser } from './dto';
import { LogService } from '../log/log.service';
import { RegisterUserDto, UpdateUserDto } from './dto';
import { SetUserPhotoDto } from './dto';
import { User, UserType } from './schemas/user-schema';
import { UserFilterDto } from './dto';
import { UserFilterQueryDto } from './dto';
import { UserStatusEnum } from '../../constants';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserType>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private logService: LogService,
    private fileService: FileService,
  ) {}

  async getUsers(): Promise<IUser[]> {
    return await this.userModel.find().exec();
  }

  async getUserById(userID: string): Promise<IUser> {
    const userById = await this.userModel.findById(userID).exec();
    if (!userById) {
      throw new NotFoundException('user not found');
    }
    return userById;
  }

  async registerUser(userDto: RegisterUserDto): Promise<IUser> {
    const newUser = new this.userModel(userDto);
    return await newUser.save();
  }

  async updateUserByProperty(
    authId: string,
    property: UpdateUserDto,
  ): Promise<IUser> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(authId, property, { new: true })
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

  async removeUserByEmail(email: Partial<IUser>): Promise<object> {
    const deletedUser = await this.userModel
      .deleteOne(email)
      .select(['-password'])
      .exec();

    if (!deletedUser) {
      throw new NotFoundException('Remote user was not found');
    }
    return deletedUser;
  }

  async updateUserByParam(
    userID: string,
    param: Partial<IUser>,
  ): Promise<IUser> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userID, param, { new: true })
      .select(['+password'])
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
    const userWithSameEmail = await this.userModel.findOne(email).exec();

    if (userWithSameEmail) {
      throw new BadRequestException(
        `User with this e-mail ${userWithSameEmail.email} is already registered. Please login`,
      );
    }
    return userWithSameEmail;
  }

  async findUserLoginByEmail(email: Partial<IUser>): Promise<IUser> {
    const userLoginByEmail = await this.userModel
      .findOne(email)
      .select('+password')
      .exec();

    if (!userLoginByEmail) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return userLoginByEmail;
  }

  async getUsersByFilter(query: UserFilterQueryDto): Promise<IUser[]> {
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

  async setUserPhoto(
    authId: string,
    file: Express.Multer.File,
    setUserPhotoDto: SetUserPhotoDto,
  ): Promise<IUser> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      authId,
      { photo: file.originalname },
      { new: true },
    );

    await this.fileService.setSingleFile(setUserPhotoDto as IFile, authId);

    const pathBase = `${process.cwd()}/upload`;
    const pathIn = `${pathBase}/${file.originalname}`;
    const pathDest = `${pathBase}/${setUserPhotoDto.affiliation}/
    ${setUserPhotoDto.mime}/${file.originalname}`;

    await fs.move(pathIn, pathDest, { overwrite: true });

    return updatedUser;
  }
}
