import { Strategy as JwtStrategy, ExtractJwt, type StrategyOptions, type VerifiedCallback } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';
import prisma from './prisma.js';
import config from './index.js';
import * as authService from '../services/auth.service.js';

const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.secret,
};

const jwtStrategy = new JwtStrategy(
  jwtOptions,
  async (payload: { sub: number }, done: VerifiedCallback) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (user) {
        // 보안을 위해 비밀번호 필드를 제거한 후 req.user에 담습니다.
        const { password, ...userWithoutPassword } = user;
        return done(null, userWithoutPassword);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  }
);

const localStrategy = new LocalStrategy(
  { usernameField: 'email' },
  async (email: string, password: string, done: (error: any, user?: any, options?: { message: string }) => void) => {
    try {
      const user = await authService.validateUserPassword(email, password);
      // 로그인 성공 시에도 비밀번호는 반환하지 않습니다.
      const { password: _, ...userWithoutPassword } = user;
      return done(null, userWithoutPassword);
    } catch (error) {
      return done(error, false, { message: (error as Error).message });
    }
  }
);

passport.use(jwtStrategy);
passport.use(localStrategy);

export default passport;

