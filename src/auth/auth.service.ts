import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { SessionService } from './session.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionService: SessionService,
  ) {}

  async login(id: string, password: string): Promise<string> {
    const user = await this.userRepository.findById(id);
    if (user && user.password === password) {
      return this.sessionService.createSession(user.id);
    }
    throw new Error('인증 실패');
  }

  async checkAndExtendSession(sessionToken: string): Promise<string> {
    const userId = this.sessionService.getUserId(sessionToken);
    if (!userId) {
      throw new Error('유효하지 않은 세션');
    }
    return this.sessionService.extendSession(sessionToken);
  }
}
