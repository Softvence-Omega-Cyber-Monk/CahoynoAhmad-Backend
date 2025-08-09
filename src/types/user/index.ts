export type TJwtPayload = {
  userId: string;
  email: string;
  fullName: string;
  userName: string;
  role: 'ADMIN' | 'USER';
};

export type TUser = {
  id: string;
  email: string;
  fullName: string;
  userName: string;
  coverPhoto: string;
  profilePhoto: string;
  bio: string;
  website: string;
  location: string;
  verified: boolean;
  creditLimit: number;
  creditUsed: number;
  creditBlance: number;
  isActive: boolean;
  isDeleted: boolean;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  xUrl: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};
