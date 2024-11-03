import type { NestMiddleware } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl: url, params, query, body, headers } = req;

    const originalSend = res.send;
    res.send = (responseBody) => {
      const statusCode = res.statusCode;

      // 응답 전송
      res.send = originalSend;
      const originalRes = res.send(responseBody);

      // 로그 남기기
      Logger.log(
        `${method} ${url} ${statusCode}\n ========================[REQUEST]========================\n` +
          `Params: ${JSON.stringify(params, null, 2)}\n` +
          `Query: ${JSON.stringify(query, null, 2).replace(/,/g, ',\n')}\n` +
          `Body: { \n` +
          Object.keys(body)
            .map((key) => `  "${key}": "${body[key]}"`)
            .join(',\n') +
          `\n}\n` +
          `Headers: {\n` +
          Object.keys(headers)
            .map((key) => `  "${key}": "${headers[key]}"`)
            .join(',\n') +
          `\n}\n` +
          `========================[RESPONSE]========================\n` +
          `Status:${statusCode}\n` +
          `Body: ${JSON.stringify(JSON.parse(responseBody), null, '').replace(/,/g, ',\n')}`,
      );

      return originalRes;
    };

    next();
  }
}
