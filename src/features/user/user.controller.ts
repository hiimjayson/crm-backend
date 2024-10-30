import {
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SessionService } from '../auth/session.service';
import { ApiResponse } from 'src/common/api-response';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
  ) {}

  @Get('me')
  async getMe(@Headers('authorization') authHeader: string) {
    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new HttpException(
          '인증 헤더가 없거나 잘못됨',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const sessionToken = authHeader.split('Bearer ')[1];
      const userId = this.sessionService.getUserId(sessionToken);

      if (!userId) {
        throw new HttpException('유효하지 않은 세션', HttpStatus.UNAUTHORIZED);
      }

      const user = await this.userService.getUserById(userId);
      if (!user) {
        throw new HttpException('사용자를 찾을 수 없음', HttpStatus.NOT_FOUND);
      }

      return ApiResponse.of(user);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
