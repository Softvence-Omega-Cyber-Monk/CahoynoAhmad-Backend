import { TJwtPayload } from './user';

declare global {
  namespace Express {
    interface Request {
      user: TJwtPayload;
    }
  }
}
