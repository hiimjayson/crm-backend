import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse } from 'src/common/api-response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { id: string; password: string }) {
    try {
      const sessionId = await this.authService.login(
        loginDto.id,
        loginDto.password,
      );
      return ApiResponse.of({ sessionId });
    } catch (error) {
      throw new HttpException('인증 실패', HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('check')
  async checkSession(@Headers('authorization') authHeader: string) {
    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new HttpException(
          '인증 헤더가 없거나 잘못됨',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const sessionToken = authHeader.split('Bearer ')[1];
      const sessionId =
        await this.authService.checkAndExtendSession(sessionToken);
      return ApiResponse.of({ sessionId });
    } catch (error) {
      throw new HttpException('유효하지 않은 세션', HttpStatus.UNAUTHORIZED);
    }
  }
}
