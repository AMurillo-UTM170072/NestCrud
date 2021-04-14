import { Module } from '@nestjs/common';
import { RolController } from './rol.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolService } from './rol.service';
import { RolEntity } from './rol.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RolEntity])],
  providers: [RolService],
  controllers: [RolController]
})
export class RolModule {}
