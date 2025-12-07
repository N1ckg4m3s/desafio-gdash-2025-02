import { Controller, Post, Body } from '@nestjs/common';
import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post()
    async Verify(@Body() AuthDto: AuthDto) {
        return this.authService.login(AuthDto);
    }
}
