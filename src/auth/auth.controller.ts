import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { NuevoUsuarioDto } from './DTO/usuario-nuevo.dto';
import { LoginUsuarioDTO } from './DTO/login.dto';
import {  tokenDTO   } from './DTO/token.dto'

@Controller('auth')
export class AuthController {
    constructor(private readonly identificacionService: AuthService){

    }
    @Get()
    getAll() {
        return this.identificacionService.getall();
    }

    @UsePipes(new ValidationPipe({whitelist: true}))
    @Post('nuevo')
    create(@Body() dto: NuevoUsuarioDto) {
        return this.identificacionService.create(dto);
    }

    @UsePipes(new ValidationPipe({whitelist: true}))
    @Post('login')
    login(@Body() dto: LoginUsuarioDTO) {
        return this.identificacionService.login(dto);
    }
    @Post('refresh')
    refresh(@Body() dto: tokenDTO) {
        return this.identificacionService.refresh(dto);
    }
}
