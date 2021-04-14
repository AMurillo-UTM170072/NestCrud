import { Module } from '@nestjs/common';
import { AdministradorService } from './administrador.service';
import { AdministradorController } from './administrador.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Administradorentity } from './administrador.entity';

@Module({
    imports:[  TypeOrmModule.forFeature([Administradorentity])  ],
  providers: [AdministradorService],
  controllers: [AdministradorController]
})
export class AdministradorModule {}
