import { LOGIN_BY } from '../../user/enums/user.enum';

export interface UserSocial {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  country: string;
  loginBy: LOGIN_BY;
}
