import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { IsNotBlank } from "src/Validators/IsnotBlank.decorator";

export class administradorDTO{
    @IsString()
    @IsNotEmpty()
    @IsNotBlank({message:'no deben de haver espacios en blanco'})
    Nombre?:string;
    @IsString()
    @IsNotEmpty()
    apPat?:string;
    @IsString()
    apMat?:string;
    @IsNumber()
    @IsNotEmpty()
    telefono?:number;
}