import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DB_HOST,DB_PASSWORD,DB_NAME,DB_PORT,DB_USER } from './config/constans';
import { AdministradorModule } from './administrador/administrador/administrador.module';
import { UsuarioModule } from './usuario/usuario.module';
import { RolModule } from './rol/rol/rol.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports:[ ConfigModule.forRoot({ 
    envFilePath:'.env',
    isGlobal:true
    }), 
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>(DB_HOST),
        port: +configService.get<number>(DB_PORT),
        username: configService.get<string>(DB_USER),
        password: configService.get<string>(DB_PASSWORD),
        database: configService.get<string>(DB_NAME),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize: true,
        logging:false,
      }),
      inject: [ConfigService],
    }), AdministradorModule, UsuarioModule, RolModule, AuthModule,  
    
  ],
  controllers: [AppController],
  providers: [ AppService],
})
export class AppModule {}

