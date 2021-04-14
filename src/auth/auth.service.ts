import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MesageDTO } from 'src/common/message.dto';
import { RolEntity } from 'src/rol/rol/rol.entity';
import { RolNombre } from 'src/rol/rol/rol.enum';
import { RolRepository } from 'src/rol/rol/rol.respository';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { AuthRepository } from './auth.repository';
import { NuevoUsuarioDto } from './DTO/usuario-nuevo.dto';
import { LoginUsuarioDTO } from './DTO/login.dto';
import {compare} from 'bcryptjs';
import { PayloadInterface } from './playload.interface';
import { JwtService } from '@nestjs/jwt';
import { tokenDTO } from './DTO/token.dto';

@Injectable()
export class AuthService {
    constructor
        (
        @InjectRepository(RolEntity)
        private readonly rolRepository: RolRepository,
        @InjectRepository(UsuarioEntity)
        private readonly authRepository: AuthRepository,
        private readonly jwsService:JwtService
        )
    {}
    async getall(): Promise<UsuarioEntity[]> {
        const usuarios = await this.authRepository.find();
        if(!usuarios.length) throw new NotFoundException(new MesageDTO('no hay usuarios en la lista'));
        return usuarios;
    }
    
    async create(dto: NuevoUsuarioDto ): Promise<any> {
        const {nombreUsuario, email} = dto;
        const exists = await this.authRepository.findOne({where: [{nombreUsuario: nombreUsuario}, {email: email}]});
        if(exists) throw new BadRequestException(new MesageDTO('ese usuario ya existe'));
        const rolUser = await this.rolRepository.findOne({where: {rolNombre: RolNombre.USER}});
        if( !rolUser) throw new InternalServerErrorException(new MesageDTO('los roles aún no han sido creados'));
        const admin = this.authRepository.create(dto);
        admin.roles = [ rolUser];
        await this.authRepository.save(admin);
        return new MesageDTO('usuario creado');
    }
    async login( DTO:LoginUsuarioDTO): Promise<any> {
        const {nombreUsuario} = DTO; 
        const usuario = await this.authRepository.findOne({where: [{nombreUsuario: nombreUsuario}, {email: nombreUsuario}]});
        if(!usuario) return new UnauthorizedException(new MesageDTO('no existe en la base de datos'));
        const passWordOK=await compare(DTO.password,usuario.password);
        if(!passWordOK) return new UnauthorizedException(new MesageDTO('el password es incorrecto'));
        
        const payload: PayloadInterface ={
            id:usuario.id,
            nombreUsuario:usuario.nombreUsuario,
            email:usuario.email,
            roles:usuario.roles.map(rol=>rol.rolNombre as RolNombre)
        }
        const token= await this.jwsService.sign(payload);
        return {token}
    }
    async refresh(dto: tokenDTO): Promise<any> {
        const usuario = await this.jwsService.decode(dto.token);
        const payload: PayloadInterface = {
            id: usuario[`id`],
            nombreUsuario: usuario[`nombreUsuario`],
            email: usuario[`email`],
            roles: usuario[`roles`]
        }
        const token = await this.jwsService.sign(payload);
        return {token};
    }
}
