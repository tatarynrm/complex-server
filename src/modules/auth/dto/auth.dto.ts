export interface IUser {
  KOD: number;
  USER_NAME: string;
  PASSWORD: string;
  KOD_OS: number;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  surname: string;
  last_name: string;
}
export interface LoginDto {
  email: string;
  password: string;
}
