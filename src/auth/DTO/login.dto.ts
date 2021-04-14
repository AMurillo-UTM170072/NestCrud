import { IsNotBlank } from "src/Validators/IsnotBlank.decorator";

export class LoginUsuarioDTO{
    @IsNotBlank({message:'el nombre del usuario  no debe de ir vacio'})
    nombreUsuario:string;

    @IsNotBlank({message:'la cotraseña no debe de ir vacia '})
    password:string;
}