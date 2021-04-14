import { EntityRepository, Repository } from "typeorm";
import { Administradorentity } from './administrador.entity';

@EntityRepository(Administradorentity)
export class adminstradorRepository extends Repository<Administradorentity>{
}