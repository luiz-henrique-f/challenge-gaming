export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    name: string;
    username: string;
  }
}

export class AuthResponseRefreshDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
