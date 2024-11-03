import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { addMinutes, isAfter } from 'date-fns';

@Injectable()
export class SessionService {
  private sessions: Map<string, { userId: string; expiresAt: Date }> =
    new Map();

  createSession(userId: string): string {
    const sessionId = uuidv4();
    this.sessions.set(sessionId, {
      userId,
      expiresAt: addMinutes(new Date(), 30),
    });
    return sessionId;
  }

  getUserId(sessionId: string): string | undefined {
    const session = this.sessions.get(sessionId);
    console.log(sessionId, session);
    if (
      session
      // && isAfter(session.expiresAt, new Date())
    ) {
      return session.userId;
    }
    return undefined;
  }

  extendSession(sessionId: string): string {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.expiresAt = addMinutes(new Date(), 30);
      this.sessions.set(sessionId, session);
      return sessionId;
    }
    throw new Error('유효하지 않은 세션');
  }
}
