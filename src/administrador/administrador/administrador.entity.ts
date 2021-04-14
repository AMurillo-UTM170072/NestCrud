import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'Administrador',synchronize:false })
export  class Administradorentity{
    @PrimaryGeneratedColumn()
    id :number;
    @Column({type:'varchar',length:20, nullable:false })
    Nombre:string;
    @Column({type:'varchar',length:20, nullable:false })
    apPat:string;
    @Column({type:'varchar',length:20, nullable:true })
    apMat:string;
    @Column({type:'int'})
    telefono:number;
}