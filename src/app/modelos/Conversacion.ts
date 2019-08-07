import { Usuario } from './Usuario';
import { Mensaje } from './Mensaje';

export class Conversacion{
    id_chat: number
    usuarios: Usuario[]
    mensajes: Mensaje[]
}