import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/modelos/Usuario';
import { UsuarioService } from 'src/app/servicios/usuarios/usuario.service';
import { ChatService } from 'src/app/servicios/chats/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-grupo',
  templateUrl: './crear-grupo.component.html',
  styleUrls: ['./crear-grupo.component.css']
})
export class CrearGrupoComponent implements OnInit {

  constructor(private usuarioService: UsuarioService, private chatService: ChatService, private navegar: Router) { }

  // en este arreglo se guardarán todos los usuarios
  usuarios: Usuario[];
  usuariosSeleccionados: Array<String>;
  nombre: string;
  ngOnInit() {
    this.nombre = localStorage.getItem('username');
    this.usuariosSeleccionados = new Array<String>();
    // obtengo los usuarios de la bd y los guardo en mi lista local
    this.usuarioService.obtenerUsuarios().subscribe(usuarios_bd=>{
      this.usuarios = usuarios_bd;
    });
    this.usuariosSeleccionados.push(this.nombre);
  }

  crearGrupo(){
    if(this.usuariosSeleccionados.length < 3){
      alert('si quieres hablar con alguien, mándale un mensaje directo!');
    }else{
      console.log('-- nombres de los usuarios a buscar')
      console.log(this.usuariosSeleccionados)
      this.chatService.obtenerConversacion({usernames: this.usuariosSeleccionados}).subscribe(conversacion=>{
        console.log(' ')
        console.log('-- conver obtenida')
        console.log(conversacion)

        //si ya tiene una conversación registrada, la muestra
        if(conversacion){
          // mando los mensajes por el socket del chat
          alert('ya hay una conversacion con estos usuarios!');
        }
        // si no tiene una conversación registrada, comienza el proceso de registro
        else{
          if(!conversacion){
            // si no tiene un chat registrado, le crea uno
            this.chatService.registrarChat().subscribe(chat => {
              
              // creamos un json que tendrá los datos del registro
              let datos = { "chat_id": chat.id, 
                            "usuarios": this.usuariosSeleccionados,
                            "mensajes":[{ "emisor": 1, "msj":"", "tipo":1, "estado":1 }] };
                
              console.log('-- datos a registrar')
              console.log(datos);
              // registro una conversación con el id del chat que acabo de registrar y los datos            
              this.chatService.registrarConversacion(datos).subscribe(conversacion =>{
                try{
                  console.log('-- conver de la bd al registrar')
                  console.log(conversacion)
                  alert('se registró con éxito la conversación!');
                  this.navegar.navigate(['/chats']);
                }catch(e){ console.log(e); }
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
