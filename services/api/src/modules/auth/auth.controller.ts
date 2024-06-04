import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreatePatientDto, RefreshTokenDto, SingInDto } from './dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard, RefreshTokenGuard } from 'src/modules/auth/guards';
import { AuthTokens, JwtPayloadUser, RefreshJwtPayload } from './types';
import { UserEntity } from '../users/user.entity';
import { Role, User } from './decorators';
import { UserRoleEnum } from '../users/enums';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  signIn(@Body() data: SingInDto): Promise<AuthTokens> {
    return this.authService.signIn(data);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('sign-out')
  @ApiBody({ type: RefreshTokenDto })
  signOut(@User() user: RefreshJwtPayload) {
    return this.authService.signOut({ id: user.refreshTokenId });
  }

  @UseGuards(RefreshTokenGuard)
  @Post('tokens/refresh')
  @ApiBody({ type: RefreshTokenDto })
  refreshTokens(@User() user: RefreshJwtPayload): Promise<AuthTokens> {
    return this.authService.refreshTokens(
      { id: user.id },
      { id: user.refreshTokenId },
    );
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get('profile')
  getProfile(@User() user: JwtPayloadUser): Promise<UserEntity> {
    return this.authService.findUser({ id: user.id });
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Patch('profile')
  updateProfile(
    @User() user: JwtPayloadUser,
    @Body() data: UpdateProfileDto,
  ): Promise<UserEntity> {
    return this.authService.updateUser({ id: user.id }, data);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Role(UserRoleEnum.ADMIN)
  @Post('patients')
  createPatient(
    @Body() data: CreatePatientDto,
  ): Promise<{ user: UserEntity; password: string }> {
    return this.authService.createPatient(data);
  }
}
