import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthResponseDto } from '@repo/types';
import { compareSync as bcryptCompareSync, hashSync, compareSync } from 'bcrypt';

@Injectable()
export class AuthService {
    private readonly accessTokenExpiresIn = '15m';
    private readonly refreshTokenExpiresIn = '7d';

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    async signIn(credential: { username: string; password: string }): Promise<AuthResponseDto> {
        const foundUser = await this.usersService.findByUserName(credential.username);

        if (!foundUser) throw new UnauthorizedException('Usuário não encontrado');
        if (!bcryptCompareSync(credential.password, foundUser.password)) {
            throw new UnauthorizedException('Senha incorreta');
        }

        console.log('Login bem-sucedido para:', foundUser.username);

        const tokens = await this.generateTokens(foundUser.id, foundUser.username);
        await this.updateRefreshToken(foundUser.id, tokens.refreshToken);

        return tokens;
    }

    private async generateTokens(userId: string, username: string) {
        const payload = { sub: userId, username };

        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_ACCESS_SECRET'),
            expiresIn: this.accessTokenExpiresIn,
        });

        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.refreshTokenExpiresIn,
        });

        const accessExpiresIn = 15 * 60; // 15 minutos em segundos
        return { accessToken, refreshToken, expiresIn: accessExpiresIn };
    }

    private async updateRefreshToken(userId: string, refreshToken: string) {
        const hashed = hashSync(refreshToken, 10);
        await this.usersService.update(userId, hashed );
    }

    async refreshTokens(refreshToken: string): Promise<AuthResponseDto> {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });

            const user = await this.usersService.findById(payload.sub);
            if (!user || !user.hashedRefreshToken) {
                throw new UnauthorizedException('Refresh token inválido');
            }

            const valid = compareSync(refreshToken, user.hashedRefreshToken);
            if (!valid) throw new UnauthorizedException('Refresh token inválido');

            const tokens = await this.generateTokens(user.id, user.username);
            await this.updateRefreshToken(user.id, tokens.refreshToken);

            return tokens;
        } catch (err) {
            throw new UnauthorizedException('Refresh token inválido ou expirado');
        }
    }

    async validateToken(token: string) {
        try {
            await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_ACCESS_SECRET'),
            });
            return { valid: true };
        } catch (err) {
            return { valid: false };
        }
    }
}
