import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put,
 UsePipes, ValidationPipe, UseGuards,UnauthorizedException } from '@nestjs/common';
import { AdministradorService } from './administrador.service';
import { administradorDTO } from '../DTO/administrador.dto';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { RolDecorator } from 'src/decorators/rol.decorator';
import { RolNombre } from '../../rol/rol/rol.enum';
import { RolesGuard } from '../../guards/rol.guard';

@Controller('administrador')
export class AdministradorController {
    constructor( private readonly servicioAdministrador:AdministradorService){}
    
    @RolDecorator(RolNombre.SUPERE,RolNombre.USER)
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Get()
    async getAll(){
       /* @GetPrincipal() user:any <- esto va en getAll()
        console.log(user.roles.indexOf('admin')); //revisar si hay administradores 
        compar los datos ingresados si el usuario que quiere logearse sin el permiso
      if(user.roles.indexOf('admin')<0)throw new UnauthorizedException(new MesageDTO('sin permiso para acceder'));
       */return await this.servicioAdministrador.getAll();
    }
    
    @RolDecorator(RolNombre.SUPERE,RolNombre.USER)
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Get('/:id')
    async getOne(@Param('id', ParseIntPipe) id:number){
        return await this.servicioAdministrador.getById(id);
    }

    @RolDecorator(RolNombre.SUPERE)
    @UseGuards(JwtAuthGuard,RolesGuard)
    @UsePipes(new ValidationPipe({whitelist:true}))
    @Post()
    async create(@Body() dto:administradorDTO){
        return await this.servicioAdministrador.create(dto);
    }

    @RolDecorator(RolNombre.SUPERE)
    @UseGuards(JwtAuthGuard,RolesGuard)
    @UsePipes(new ValidationPipe({whitelist:true}))
    @Put('/:id')
    async update(@Param('id',ParseIntPipe)id:number,@Body() dto:administradorDTO ){
        return await this.servicioAdministrador.Update(id,dto);
    }
    @RolDecorator(RolNombre.SUPERE,RolNombre.USER)
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Delete('/:id')
    async delete(@Param('id', ParseIntPipe) id:number){
        return await this.servicioAdministrador.delete(id);
    }
}
