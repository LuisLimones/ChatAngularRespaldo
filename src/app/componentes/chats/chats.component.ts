import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsuarioService } from 'src/app/servicios/usuarios/usuario.service';
import { Usuario } from 'src/app/modelos/Usuario';
import { ChatService } from 'src/app/servicios/chats/chat.service';
import { Router } from '@angular/router';
import { Conversacion } from 'src/app/modelos/Conversacion';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit, OnDestroy {

  constructor(private usuarioService: UsuarioService, private chatService: ChatService, private navegar: Router) { }

  existen: boolean = false;
  usuarios: Usuario[];
  usuario_logueado: Usuario;
  nombre: string;
  grupos: Array<Conversacion>;
  ngOnInit() {
    this.grupos = new Array<Conversacion>();
    this.nombre = localStorage.getItem('username');
    const id_local = parseInt(localStorage.getItem('id'));
    this.usuarioService.conectar();
    this.usuarioService.obtenerUsuarios().subscribe(usuarios_bd=>{
      this.usuarioService.enviarUsuarios(usuarios_bd);
      // dentro de todos los usuarios, busca el que se logueó con su id
      for (let i = 0; i < usuarios_bd.length; i++) {
        if(usuarios_bd[i].id == id_local){
          this.usuario_logueado = usuarios_bd[i];
          break;
        }
      }
    });

    this.usuarioService.lista_usuarios.subscribe( lista_usuarios => {
      this.usuarios = lista_usuarios;
      if(lista_usuarios.length != 0){
        this.existen = true;
      }
    });

    this.chatService.obtenerGrupos({username: this.nombre}).subscribe(grupos_bd=>{
      this.grupos = grupos_bd;
    });
  }


  ngOnDestroy(): void {
    this.chatService.cerrarConexion();
    this.usuarioService.cerrarConexion();
  }

  seleccionarUsuario(usuario: Usuario){
    if(usuario.id == this.usuario_logueado.id || usuario.username == this.nombre){
    }else{
      let usuarios = new Array<String>();
      usuarios.push(this.usuario_logueado.username);
      usuarios.push(usuario.username);
      this.chatService.cambiarUsuarios(usuarios);
      this.navegar.navigate(['/chatear']);
    }
  }

  seleccionarGrupo(conver: Conversacion){
    let usuarios = new Array<Usuario>();
    for (let i = 0; i < conver.usuarios.length; i++) {
      usuarios.push(conver.usuarios[i]);
    }
    this.chatService.cambiarUsuarios(usuarios);
    this.navegar.navigate(['/chatear']);
  }

  crearGrupo(){
    this.navegar.navigate(['/crear-grupo']);
  }

}
