import { User } from './typeorm';
import { Request } from 'express';

export type CreateUserDetails = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type ValidateUserDetails = {
  username: string;
  password: string;
};

export type FindUserParams = Partial<{
  id: number;
  email: string;
  username: string;
}>;

export type FindUserOptions = Partial<{
  selectAll: boolean;
}>;

export type UserProfileFiles = Partial<{
  banner: Express.Multer.File[];
  avatar: Express.Multer.File[];
}>;

export interface AuthenticatedRequest extends Request {
  user: User;
}
