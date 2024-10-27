import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
  private users = [
    { id: 'user1', password: 'password1' },
    { id: 'user2', password: 'password2' },
  ];

  async findById(
    id: string,
  ): Promise<{ id: string; password: string } | undefined> {
    return this.users.find((user) => user.id === id);
  }
}
