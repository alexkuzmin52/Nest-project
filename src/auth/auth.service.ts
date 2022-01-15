import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { IUser } from '../user/dto/user.inetrface';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';

import { IAuth } from './dto/auth.interface';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import { UserStatusEnum } from '../user/constants/user-status-enum';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private jwtService: JwtService,
    @InjectModel('auth') private authModel: Model<IAuth>,
  ) {}

  async registerUser(createUserDto: CreateUserDto): Promise<string> {
    const userAlreadyExist = await this.userService.findUserByParam({
      email: createUserDto.email,
    });

    if (userAlreadyExist) {
      throw new BadRequestException(
        `User with this e-mail ${createUserDto.email} is already registered`,
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = await this.userService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
    const confirmToken = await this.createToken(newUser);
    const userWithToken = await this.userService.updateUserByParam(
      newUser._id,
      { token: confirmToken },
    );
    return userWithToken.token;
  }

  async createToken(user: IUser): Promise<string> {
    return this.jwtService.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      {
        secret: this.configService.get('JWT_CONFIRM_EMAIL_SECRET'),
        expiresIn: this.configService.get('JWT_CONFIRM_EMAIL_LIFETIME'),
      },
    );
  }

  async confirmUser(confirmToken: string): Promise<object> {
    try {
      const payload = await this.jwtService.verify(confirmToken, {
        secret: this.configService.get('JWT_CONFIRM_EMAIL_SECRET'),
      });
      const userByConfirmToken = await this.userService.findUserByParam({
        token: confirmToken,
      });

      if (
        !userByConfirmToken ||
        userByConfirmToken.status !== UserStatusEnum.PENDING
      ) {
        throw new UnauthorizedException('Invalid credentials');
      }

      await this.userService.updateUserByParam(payload['id'], {
        status: UserStatusEnum.CONFIRMED,
        token: null,
      });

      return { message: 'Registration successfully confirmed. Please login' };
    } catch (e) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async loginUser(loginDto: LoginDto): Promise<object> {
    const userLogin = await this.userService.findUserByParam({
      email: loginDto.email,
    });

    if (!userLogin) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      userLogin.password,
    );

    if (userLogin.status !== UserStatusEnum.CONFIRMED || !isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      email: userLogin.email,
      id: userLogin._id,
      role: userLogin.role,
    };

    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_SECRET_LIFETIME'),
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_SECRET_LIFETIME'),
    });

    const newAuthModel = await new this.authModel({
      access_token,
      refresh_token,
      userID: userLogin._id,
    });

    await newAuthModel.save();

    return { access_token, refresh_token };
  }

  async findAuthByUserId(userID: string): Promise<boolean> {
    return Boolean(await this.authModel.findOne({ userID: userID }).exec());
  }
}
