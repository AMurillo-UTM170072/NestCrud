
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { create } from 'domain';
import { MesageDTO } from './../common/message.dto';
import { UsuarioEntity } from './usuario.entity';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolEntity } from 'src/rol/rol/rol.entity';
import { RolRepository } from 'src/rol/rol/rol.respository';
import { UsuarioRepository } from './usario.repository';
import { RolNombre } from 'src/rol/rol/rol.enum';

@Injectable()
export class UsuarioService {

    constructor(
        @InjectRepository(RolEntity)
        private readonly rolRepository: RolRepository,
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: UsuarioRepository
    ) {}

    async getall(): Promise<UsuarioEntity[]> {
        const usuarios = await this.usuarioRepository.find();
        if(!usuarios.length) throw new NotFoundException(new MesageDTO('no hay usuarios en la lista'));
        return usuarios;
    }

    async create(dto: CreateUsuarioDto): Promise<any> {
        const {nombreUsuario, email} = dto;
        const exists = await this.usuarioRepository.findOne({where: [{nombreUsuario: nombreUsuario}, {email: email}]});
        if(exists) throw new BadRequestException(new MesageDTO('ese usuario ya existe'));
        const rolAdmin = await this.rolRepository.findOne({where: {rolNombre: RolNombre.SUPERE}});
        const rolUser = await this.rolRepository.findOne({where: {rolNombre: RolNombre.USER}});
        if(!rolAdmin || !rolUser) throw new InternalServerErrorException(new MesageDTO('los roles aún no han sido creados'));
        const admin = this.usuarioRepository.create(dto);
        admin.roles = [rolAdmin, rolUser];
        await this.usuarioRepository.save(admin);
        return new MesageDTO('admin creado');
    }
}