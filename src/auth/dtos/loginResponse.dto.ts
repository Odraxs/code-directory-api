export class LoginResponseDto {
  token: string;

  constructor(token: string) {
    this.token = token;
  }
}
