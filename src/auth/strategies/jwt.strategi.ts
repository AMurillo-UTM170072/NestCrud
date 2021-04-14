
import { MesageDTO } from './../../common/message.dto';
import { ConfigService } from '@nestjs/config';
import { UsuarioEntity } from './../../usuario/usuario.entity';
import { AuthRepository } from './../auth.repository';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JWT_SECRET } from 'src/config/constans';
import { PayloadInterface } from '../playload.interface';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly authRepository: AuthRepository,
        private readonly configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get(JWT_SECRET)
        });
    }

    async validate(payload: PayloadInterface) {
        const {nombreUsuario, email} = payload;
        const usuario = await this.authRepository.findOne({where: [{nombreUsuario: nombreUsuario}, {email: email}]});
        if(!usuario) return new UnauthorizedException(new MesageDTO('credenciales erróneas'));
        return payload;
    }
}