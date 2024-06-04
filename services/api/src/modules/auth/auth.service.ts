import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto';
import { UsersService } from '../users/users.service';
import { RefreshTokensService } from '../refresh-tokens/refresh-tokens.service';
import * as bcrypt from 'bcrypt';
import { AuthTokens, AccessJwtPayload, RefreshJwtPayload } from './types';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from 'src/config/app-config.service';
import { UserEntity } from '../users/user.entity';
import { FindOptionsWhere } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { SingInDto } from './dto';
import { RefreshTokenEntity } from '../refresh-tokens/refresh-token.entity';
import { ErrorMessagesEnum } from 'src/common/enums';
import { generateRandomString } from 'src/helpers';
import { UserRoleEnum } from '../users/enums';

@Injectable()
export class AuthService {
  private readonly jwtAccessSecret =
    this.appConfigService.get<string>('JWT_ACCESS_SECRET');
  private readonly jwtAccessExpiry = this.appConfigService.get<string>(
    'JWT_ACCESS_EXPIRATION_TIME',
  );
  private readonly jwtRefreshSecret =
    this.appConfigService.get<string>('JWT_REFRESH_SECRET');
  private readonly jwtRefreshExpiry = this.appConfigService.get<string>(
    'JWT_REFRESH_EXPIRATION_TIME',
  );

  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly refreshTokensService: RefreshTokensService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<AuthTokens> {
    const userExists = await this.usersService
      .findOne({ email: createUserDto.email })
      .catch(() => null);

    if (userExists) {
      throw new ConflictException(ErrorMessagesEnum.USER_ALREADY_EXIST);
    }

    const user = await this.usersService.createOne(createUserDto);
    return this.createUserTokens(user);
  }

  async signIn(data: SingInDto): Promise<AuthTokens> {
    const user = await this.usersService
      .findOne({ email: data.email })
      .catch(() => {
        throw new UnauthorizedException(ErrorMessagesEnum.INVALID_CREDENTIALS);
      });

    const correctPassword = await bcrypt.compare(data.password, user.password);

    if (!correctPassword) {
      throw new UnauthorizedException(ErrorMessagesEnum.INVALID_CREDENTIALS);
    }

    const tokens = await this.createUserTokens(user);

    await this.refreshTokensService.deleteExpiredTokens({
      user: { id: user.id },
    });

    return tokens;
  }

  async signOut(refreshTokenId: FindOptionsWhere<RefreshTokenEntity>) {
    return this.refreshTokensService.deleteOne(refreshTokenId);
  }

  async refreshTokens(
    condition: FindOptionsWhere<UserEntity>,
    refreshTokenId: FindOptionsWhere<RefreshTokenEntity>,
  ): Promise<AuthTokens> {
    const user = await this.usersService.findOne(condition);

    await this.refreshTokensService.deleteOne(refreshTokenId);

    const tokens = await this.createUserTokens(user);

    return tokens;
  }

  async generateTokens(
    user: Partial<UserEntity>,
    refreshTokenId: string,
  ): Promise<AuthTokens> {
    const accessTokenPayload: AccessJwtPayload = {
      id: user.id,
      role: user.role,
      refreshTokenId,
    };

    const refreshTokenPayload: RefreshJwtPayload = {
      ...accessTokenPayload,
      refreshTokenId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessTokenPayload, {
        secret: this.jwtAccessSecret,
        expiresIn: this.jwtAccessExpiry,
      }),
      this.jwtService.signAsync(refreshTokenPayload, {
        secret: this.jwtRefreshSecret,
        expiresIn: this.jwtRefreshExpiry,
      }),
    ]);

    const tokens: AuthTokens = {
      accessToken,
      refreshToken,
    };

    return tokens;
  }

  async createUserTokens(user: Partial<UserEntity>): Promise<AuthTokens> {
    const refreshTokenId = uuidv4();
    const tokens = await this.generateTokens(user, refreshTokenId);
    await this.refreshTokensService.createToken(
      { id: user.id },
      { value: tokens.refreshToken, id: refreshTokenId },
    );

    return tokens;
  }

  async findUser(
    conditions: FindOptionsWhere<UserEntity>,
  ): Promise<UserEntity> {
    return this.usersService.findOne(conditions);
  }

  async updateUser(
    conditions: FindOptionsWhere<UserEntity>,
    data: Partial<UserEntity>,
  ): Promise<UserEntity> {
    return this.usersService.updateOne(conditions, data);
  }

  async updatePassword(
    conditions: FindOptionsWhere<UserEntity>,
    password: string,
  ): Promise<AuthTokens> {
    const updatedUser = await this.usersService.updateOne(conditions, {
      password,
    });
    return this.createUserTokens(updatedUser);
  }

  generateTemporaryPassword(length = 6): string {
    return generateRandomString(length);
  }

  async createPatient(
    data: Partial<UserEntity>,
  ): Promise<{ user: UserEntity; password: string }> {
    const password = this.generateTemporaryPassword();
    const user = await this.usersService.createOne({
      ...data,
      role: UserRoleEnum.PATIENT,
      password,
    });

    return { user, password };
  }
}
