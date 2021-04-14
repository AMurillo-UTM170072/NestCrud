import {  BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Administradorentity } from './administrador.entity';
import { adminstradorRepository } from './adminstrador.repository';
import { administradorDTO } from '../DTO/administrador.dto';
import { MesageDTO } from '../../common/message.dto';
@Injectable()
export class AdministradorService {
    constructor(
        @InjectRepository(Administradorentity) 
        private Admin:adminstradorRepository
    ){
        
    } 
    async getAll():Promise<Administradorentity[]> {
        const lista=await this.Admin.find();
        if(!lista.length ){
            throw new NotFoundException( new MesageDTO(' no se encontraron datos de los administradores') );
        }
        return lista;
    }

    async getById(id:number):Promise<Administradorentity>{
        const producto = await this.Admin.findOne(id);
        if(!producto){
            throw new NotFoundException( new MesageDTO(' no existe el usuario con esos datos '));
        } 
        return producto;
    }
    
    async getByNombre(nombre:string):Promise<Administradorentity>{
        const AdminstradorN = await this.Admin.findOne({Nombre:nombre});
       return AdminstradorN;
    }
    async create(dto:administradorDTO):Promise<any>{
       //en  caso de que se necesite hacer la matricula unica para poder hacer una comparacion
        const comparar=await this.getByNombre(dto.Nombre)
        if(comparar)throw new BadRequestException({messge:'no se debe de repetir el nombre'});
        const cadmin= this.Admin.create(dto);
        await this.Admin.save(cadmin);
        return new MesageDTO(`administrador Creado ${cadmin.Nombre}`);
        /*{message:`se ha creado un adminstrador de nombre:${cadmin.Nombre}`}*/
    }
    async Update(id:number, dto:administradorDTO):Promise<any>{
        const uadmin= await this.getById(id); 
        if(!uadmin)throw new BadRequestException({messge:'no existe el Administrador :( '});
        const comparar=await this.getByNombre(dto.Nombre)
        if(comparar && comparar.id !== id)throw new BadRequestException({messge:'no se debe de repetir el nombre'});
        const cadmin= this.Admin.create(dto);
        dto.Nombre? uadmin.Nombre=dto.Nombre:uadmin.Nombre=uadmin.Nombre;
        dto.apPat ? uadmin.apPat=dto.apPat:uadmin.apPat=uadmin.apPat;
        dto.apMat ? uadmin.apMat=dto.apMat:uadmin.apMat=uadmin.apMat;
        dto.telefono ? uadmin.telefono=dto.telefono:uadmin.telefono=uadmin.telefono;
        await this.Admin.save(uadmin);
        return new MesageDTO(` se ha actualizado correctamente el administrador: ${uadmin.Nombre}`);
    }
    async delete(id:number):Promise<any>{
        const delAdmin= await this.getById(id);
        await this.Admin.delete(delAdmin);
        return new MesageDTO(`se ha eliminado l el administrador: ${delAdmin.Nombre}`);
    }
}
