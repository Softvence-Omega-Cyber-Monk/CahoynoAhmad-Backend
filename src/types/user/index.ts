export type TJwtPayload = {
  userId: string;
  email: string;
  fullName: string;
  userName: string;
  role: 'ADMIN' | 'USER';
};
