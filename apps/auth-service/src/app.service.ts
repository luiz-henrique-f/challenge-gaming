import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // constructor(private jwtService: JwtService) {}

  /*login(credential: { username: string; password: string }) {
    // utilizar db aqui depois

    if(credential.username === 'admin' && credential.password === 'password') {
      const payload = {
        sub: '123',
        username: credential.username,
        role: 'admin',
      };
      const token = this.jwtService.sign(payload);
      return {token};
    }
    throw new Error('Invalid credentials');
  }*/

  /*async validateToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return { valid: true, userId: decoded.sub, role: decoded.role };
    } catch(err){
      return { valid: false, userId: null, role: null };
    }
  }*/
}
