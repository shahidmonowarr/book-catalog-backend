export type ISignInUser = {
  email: string;
  password: string;
};
export type ISignInUserResponse = {
  accessToken: string;
  refreshToken?: string;
};
