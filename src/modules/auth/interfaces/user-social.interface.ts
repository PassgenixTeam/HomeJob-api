import { LOGIN_BY } from '../../user/enums/user.enum';

export interface UserSocial {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  country: string;
  loginBy: LOGIN_BY;
}
