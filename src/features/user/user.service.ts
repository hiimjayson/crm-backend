import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) return undefined;

    // 비밀번호는 제외하고 반환
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
