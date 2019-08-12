import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/modelos/Usuario';
import { UsuarioService } from 'src/app/servicios/usuarios/usuario.service';
import { ChatService } from 'src/app/servicios/chats/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.css']
})
export class GrupoComponent implements OnInit {

  constructor(private usuarioService: UsuarioService, private chatService: ChatService, private router: Router) { }

  usuarios: Usuario[];
  usuariosSeleccionados: Array<String>;
  nombre: string;

  ngOnInit() {
    this.nombre = localStorage.getItem('username');
    this.usuariosSeleccionados = new Array<String>();
    this.usuarioService.obtenerUsuarios().subscribe(usuarios_bd=>{
      this.usuarios = usuarios_bd;
    });
    this.usuariosSeleccionados.push(this.nombre);
  }

  crearGrupo(){
    //Filtro Grupo
    if(this.usuariosSeleccionados.length < 3){
      alert('Un grupo son 3 o mas personas\nPuedes hablar en privado seleccionando al usuario individualmente');
    }else{
      this.chatService.obtenerConversacion({usernames: this.usuariosSeleccionados}).subscribe(conversacion=>{
        //Filtro Grupo Igual
        if(conversacion){
          alert('Ya existe un grupo con estos usuarios');
        }
        else{
          //Crea Conversacion
          if(!conversacion){
            this.chatService.registrarChat().subscribe(chat => {
              let datos = { "chat_id": chat.id, 
                            "usuarios": this.usuariosSeleccionados,
                            "mensajes":[{ "emisor": 1, "msj":"", "tipo":1, "estado":1 }] };        
              this.chatService.registrarConversacion(datos).subscribe(conversacion =>{
                try{
                  alert('Grupo Creado');
                  this.router.navigate(['/chats']);
                }
                catch(e){ 
                  console.log(e); 
                }
              });
            });
          }
        }
      });
    }
  }

  cambiarOpcion(nombre_selec, event){
    if(event.target.checked) {
      this.usuariosSeleccionados.push(nombre_selec);
    } else {
      for(var i=0 ; i < this.usuariosSeleccionados.length; i++) {
        if(this.usuariosSeleccionados[i] == nombre_selec) {
          this.usuariosSeleccionados.splice(i,1);
        }
      }
    }
  }

}
