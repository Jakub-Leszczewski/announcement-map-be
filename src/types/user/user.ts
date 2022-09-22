export interface UserInterface {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  hashPwd: string;
  photoFn: string;
  jwtId: string;
}

export type UserSaveData = Omit<UserInterface, 'hashPwd'>;
export type UserSaveResponseData = Omit<UserSaveData, 'photoFn' | 'jwtId'> & {
  avatar: string;
};
