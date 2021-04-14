import { RolEntity } from './rol.entity';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolRepository } from './rol.respository';
import { MesageDTO } from 'src/common/message.dto';
import { CreateRolDto } from '../dto/create-rol.dto';

@Injectable()
export class RolService {

    constructor(
        @InjectRepository(RolEntity)
        private readonly rolRepository: RolRepository
    ) {}

    async getall(): Promise<RolEntity[]> {
        const roles = await this.rolRepository.find();
        if(!roles.length) throw new NotFoundException(new MesageDTO('no hay roles en la lista'));
        return roles;
    }

    async create(dto: CreateRolDto): Promise<any> {
        const exists = await this.rolRepository.findOne({where: {rolNombre: dto.rolNombre}});
        if(exists) throw new BadRequestException(new MesageDTO('ese rol ya existe'));
        await this.rolRepository.save(dto as RolEntity);
        return new MesageDTO('rol creado');
    }
}