import { Role } from "../../../generated/prisma/enums";

export type IRegisterUser = {
  name: string;
  email: string;
  password: string;
  role?: Role;
  profilePhoto?: string;
};

export type IProfileUpdate = {
  name?: string;
  profilePhoto?: string;
  bio?: string;
  experience: number;
  skills?:string[],
};

export interface ILoginUser {
  email: string;
  password: string;
}
