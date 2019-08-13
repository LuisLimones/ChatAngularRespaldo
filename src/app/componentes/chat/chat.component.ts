import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from 'src/app/servicios/chats/chat.service';
import { Mensaje } from 'src/app/modelos/Mensaje';
import { Usuario } from 'src/app/modelos/Usuario';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { servidorURL } from 'src/app/globales/Globales'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  constructor(private navegar: Router, private chatService: ChatService,private http:HttpClient,
    private toastr: ToastrService) { }

  usuario_logueado: Usuario;
  nombre: string;
  usuarios_locales: Array<Usuario>;
  nombres_usuarios: Array<String>;
  bandera_chat: boolean; 
  id_chat: number;
  mensajes: Array<Mensaje>;
  mensaje: string;

  ngOnInit() {
    this.usuario_logueado = new Usuario();
    this.mensajes = new Array<Mensaje>();
    this.usuarios_locales = new Array<Usuario>();
    this.nombres_usuarios = new Array<String>();
    this.id_chat = null;
    this.bandera_chat = false;
    this.usuario_logueado.id = parseInt(localStorage.getItem('id'));
    this.nombre = localStorage.getItem('username');
    this.chatService.usuarios.subscribe( us =>{
      if(us[0].id == 0){ 
        this.navegar.navigate(['/chats']) 
      }else{
        this.usuarios_locales = us;
        for (let i = 0; i < us.length; i++) {
          this.nombres_usuarios = us[i];
        }
      }
    });
    this.chatService.obtenerConversacion({usernames: this.usuarios_locales}).subscribe(conversacion=>{
      if(conversacion != null && this.usuarios_locales[0].id != 0){
        this.chatService.conectar(conversacion.id_chat);
        this.bandera_chat = true;
        this.id_chat = conversacion['id_chat'];
        this.chatService.enviarMensajes(conversacion['mensajes']);
        this.chatService.getSocket().on('escribiendomsj', () => {
          try {
            this.toastr.info("Escribiendo...","", {
              timeOut: 1000
            });
          } catch (e) {
            console.log(e);
          }
        });
      }
      else{
        if(this.usuarios_locales[0].id != 0){
          this.chatService.registrarChat().subscribe(chat => {
            this.chatService.conectar(chat.id);
            this.bandera_chat = true;
            this.id_chat = chat.id;
            let datos = { "chat_id":chat.id, 
                          "usuarios": this.usuarios_locales,
                          "mensajes":[{ "emisor":this.usuario_logueado.username, 
                          "msj":"", "tipo":1, "estado":1 }] };         
            this.chatService.registrarConversacion(datos).subscribe(conversacion =>{
              try{
                this.chatService.enviarMensajes(conversacion['mensajes']);
              }catch(e){
                console.log(e); 
              }
            });
          });
        }
      }
    });
    this.chatService.mensajesActuales.subscribe(mensajes =>{
      this.mensajes = mensajes;
    });
    
  }

  ngOnDestroy(): void {
    this.mensajes = new Array<Mensaje>();
    this.bandera_chat = false;
    this.usuarios_locales = new Array<Usuario>();
    this.id_chat = 0;
    this.chatService.cerrarConexion();
    this.chatService.actualizarMensajes(null);
  }
  escribiendo(){
    this.chatService.uEscribiendo();
  }
 

  mandarMensaje(){
    let datos = {id_chat: this.id_chat, mensaje: {emisor: this.nombre, msj: this.mensaje, estado: 1, tipo: 1}};
    this.chatService.enviarMensaje(datos).subscribe( mensajes => {
      this.chatService.enviarMensajes(mensajes[0]['mensajes']);
      this.mensaje = "";
    });
  }

  url: string = servidorURL+'archivos';

  guardaraudio(event){ 
    console.log("Guardar Audio")
    let elemnt = event.target
    let formData = new FormData()     
    let msj;
     if(elemnt.files.length > 0)
     {
       formData.append('file',elemnt.files[0])
       this.http.post<any>(this.url, formData).subscribe(res =>{
         msj = {emisor:this.nombre,msj:res.url,tipo:4,estado:1};
         let datos = {id_chat: this.id_chat, mensaje:msj};
         this.chatService.enviarMensaje(datos).subscribe( mensajes => {
          this.chatService.enviarMensajes(mensajes[0]['mensajes']);
          this.mensaje = "";
        });
       })
     }  
  }
  guardarimagen(event){
    let elemnt = event.target
    let formData = new FormData()     
    let msj;
     if(elemnt.files.length > 0)
     {
       formData.append('file',elemnt.files[0])
       this.http.post<any>(this.url, formData).subscribe(res =>{
         msj = {emisor:this.nombre,msj:res.url,tipo:2,estado:1};
         let datos = {id_chat: this.id_chat, mensaje:msj};
         this.chatService.enviarMensaje(datos).subscribe( mensajes => {
          this.chatService.enviarMensajes(mensajes[0]['mensajes']);
          this.mensaje = "";
        });
       })
     }

  }
  guardarvideo(event){
    let elemnt = event.target
    let formData = new FormData()     
    let msj;
     if(elemnt.files.length > 0)
     {
       formData.append('file',elemnt.files[0])
       this.http.post<any>(this.url, formData).subscribe(res =>{
         msj = {emisor:this.nombre,msj:res.url,tipo:3,estado:1};
         let datos = {id_chat: this.id_chat, mensaje:msj};
         this.chatService.enviarMensaje(datos).subscribe( mensajes => {
          this.chatService.enviarMensajes(mensajes[0]['mensajes']);
          this.mensaje = "";
        });
       })
     }
  }
}