import { Role } from "../../../generated/prisma/enums";

export type IRegisterUser = {
  name: string;
  email: string;
  password: string;
  role?: Role;
  profilePhoto?: string;
};


export interface ILoginUser {
  email: string;
  password: string;
}
