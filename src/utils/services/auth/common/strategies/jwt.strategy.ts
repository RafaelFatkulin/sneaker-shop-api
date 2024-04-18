import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    });
  }

  // eslint-disable-next-line @typescript-eslint/require-await,class-methods-use-this
  async validate(payload: any, done: (error?: Error | null, data?: any) => void) {
    try {
      done(null, {
        ...payload
      });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
      throw new UnauthorizedException('Unauthorized', error?.message);
    }
  }
}
