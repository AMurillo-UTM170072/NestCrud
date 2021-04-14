import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { RolEntity } from '../rol/rol/rol.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JWT_SECRET } from 'src/config/constans';
import { JwtStrategy } from './strategies/jwt.strategi';

@Module({
    imports:[  TypeOrmModule.forFeature([UsuarioEntity, RolEntity,AuthRepository]),
    PassportModule.register({
        defaultStrategy: 'jwt'
      }),
      JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          secret: configService.get(JWT_SECRET),
          signOptions: {
            expiresIn: 20
          }
        }),
        inject: [ConfigService],
      }),
  ],
    providers:[AuthService, ConfigService,JwtStrategy],
    controllers:[AuthController],
    exports:[ PassportModule,JwtStrategy ],
})
export class AuthModule {}
