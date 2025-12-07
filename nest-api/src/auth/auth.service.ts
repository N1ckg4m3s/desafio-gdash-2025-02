import { BadRequestException, forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './auth.dto';
import { promisify } from 'util';
import { timingSafeEqual, scrypt as _scrypt } from 'crypto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async validateUser(email: string, password: string) {
        const userResponse = await this.usersService.findByEmail(email);
        if (!userResponse.success || !userResponse.data?.password) return null;

        const parts = userResponse.data.password.split(':');
        if (parts.length !== 2) return null;

        const [salt, key] = parts;
        const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

        const isMatch = timingSafeEqual(Buffer.from(key, 'hex'), derivedKey);
        if (!isMatch) return null;

        const { password: _, ...userWithoutPassword } = userResponse.data;
        return userWithoutPassword;
    }

    async login(authDto: AuthDto) {
        if (!authDto.email || !authDto.password) {
            throw new BadRequestException('Email e senha são obrigatórios');
        }

        const user = await this.validateUser(authDto.email, authDto.password);

        if (!user) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const payload = { email: user.username, sub: user.id, role: user.role };
        const token = this.jwtService.sign(payload, { expiresIn: '1h' });

        return {
            access_token: token,
            user
        };
    }

    async verifyToken(token: string) {
        return this.jwtService.verifyAsync(token);
    }
}
