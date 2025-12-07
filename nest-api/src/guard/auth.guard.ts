import {
    CanActivate,
    ExecutionContext,
    forwardRef,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const authHeader = request.headers['authorization'];

        if (!authHeader) {
            throw new UnauthorizedException('Token não fornecido');
        }

        const [type, token] = authHeader.split(' ');

        if (type !== 'Bearer') {
            throw new UnauthorizedException('Formato de token inválido');
        }

        if (!token || token.trim() === '') {
            throw new UnauthorizedException('Token vazio');
        }

        try {
            const payload = await this.authService.verifyToken(token);

            request.user = payload;
            return true;
        } catch {
            throw new UnauthorizedException('Token expirado ou inválido');
        }
    }
}