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
      return { sessionId };
    } catch (error) {
      throw new HttpException('인증 실패', HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('check')
  async checkSession(@Headers('session-token') sessionToken: string) {
    try {
      const sessionId =
        await this.authService.checkAndExtendSession(sessionToken);
      return { sessionId };
    } catch (error) {
      throw new HttpException('유효하지 않은 세션', HttpStatus.UNAUTHORIZED);
    }
  }
}
