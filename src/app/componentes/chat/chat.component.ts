import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from 'src/app/servicios/chats/chat.service';
import { Mensaje } from 'src/app/modelos/Mensaje';
import { Usuario } from 'src/app/modelos/Usuario';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  constructor(private navegar: Router, private chatService: ChatService,private http:HttpClient, private toastr: ToastrService) { }

  // estos son los usuarios en los que se buscará el chat
  usuario_logueado: Usuario;
  nombre: string;
  usuarios_locales: Array<Usuario>;
  nombres_usuarios: Array<String>;
  // para verificar que exista un chat registrado
  hay_chat: boolean; id_chat: number;
  // aqui se guarda la conver que tiene todos los mensajes del chat
  mensajes: Array<Mensaje>;
  // este es el input que manda el mensaje
  mensaje: string;
  estado_t: string;
  public escribiendo_t = false;
  ngOnInit() {
    this.usuario_logueado = new Usuario();
    this.mensajes = new Array<Mensaje>();
    this.usuarios_locales = new Array<Usuario>();
    this.nombres_usuarios = new Array<String>();
    this.id_chat = null;
    this.hay_chat = false;

    // obtenemos el id del usuario logueado del local storage
    this.usuario_logueado.id = parseInt(localStorage.getItem('id'));
    this.nombre = localStorage.getItem('username');

    this.chatService.usuarios.subscribe( us =>{
      if(us[0].id == 0){ 
        this.navegar.navigate(['/chats']) 
      }else{
        this.usuarios_locales = us;
        console.log('-- arreglo de usuarios en el behaviour')
        console.log(this.usuarios_locales)
        for (let i = 0; i < us.length; i++) {
          this.nombres_usuarios = us[i];
        }
      }
    });

    console.log('-- nombres de los usuarios a buscar')
    console.log(this.usuarios_locales)
    this.chatService.obtenerConversacion({usernames: this.usuarios_locales}).subscribe(conversacion=>{
      console.log(' ')
      console.log('-- conver obtenida')
      console.log(conversacion)

      //si ya tiene una conversación registrada, la muestra
      if(conversacion != null && this.usuarios_locales[0].id != 0){

        // creo la conexión al socket del chat
        this.chatService.conectar(conversacion.id_chat);
        this.hay_chat = true;
        this.id_chat = conversacion['id_chat'];
        
        // mando los mensajes por el socket del chat
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
      // si no tiene una conversación registrada, comienza el proceso de registro
      else{
        if(this.usuarios_locales[0].id != 0){
          // si no tiene un chat registrado, le crea uno
          this.chatService.registrarChat().subscribe(chat => {
            
            this.chatService.conectar(chat.id);
            this.hay_chat = true;
            this.id_chat = chat.id;
            
            // creamos un json que tendrá los datos del registro
            let datos = { "chat_id":chat.id, 
                          "usuarios": this.usuarios_locales,
                          "mensajes":[{ "emisor":this.usuario_logueado.username, "msj":"", "tipo":1, "estado":1 }] };
              
            console.log('-- datos a registrar')
            console.log(datos);
            // registro una conversación con el id del chat que acabo de registrar y los datos            
            this.chatService.registrarConversacion(datos).subscribe(conversacion =>{
              try{
                console.log('-- conver de la bd al registrar')
                console.log(conversacion)
                // mando los mensajes por el socket del chat
                this.chatService.enviarMensajes(conversacion['mensajes']);
              }catch(e){ console.log(e); }
            });
          });
        } // fin del if conver = undefined
      }
    });

    // me suscribo a los mensajes, para que se mantengan actualizados
    this.chatService.mensajesActuales.subscribe(mensajes =>{
      this.mensajes = mensajes;
      console.log('-- cambiaron los mensajes del servicio');
      console.log(mensajes);
    });
    
  }

  ngOnDestroy(): void {
    this.mensajes = new Array<Mensaje>();
    this.hay_chat = false;
    this.usuarios_locales = new Array<Usuario>();
    this.id_chat = 0;
    this.chatService.cerrarConexion();
    this.chatService.actualizarMensajes(null);
  }
  escribiendo(){
    this.chatService.uEscribiendo();

  }
 

  mandarMensaje(){

    // creo un json con los datos del mensaje
    let datos = {id_chat: this.id_chat, mensaje: {emisor: this.nombre, msj: this.mensaje, estado: 1, tipo: 1}};
    // envío en mensaje a registrar 
    this.chatService.enviarMensaje(datos).subscribe( mensajes => {
      this.chatService.enviarMensajes(mensajes[0]['mensajes']);
      this.mensaje = "";
    });
  }

  /*Metodos para Enviar archivos*/
  guardaraudio(event){ 
    console.log("Guardar Audio")
    let elemnt = event.target
    let formData = new FormData()     
    let msj;
     if(elemnt.files.length > 0)
     {
       console.log("pasa if")
       formData.append('file',elemnt.files[0])
       this.http.post<any>('http://127.0.0.1:3333/archivos',formData).subscribe(res =>{
       console.log(res);
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
       this.http.post<any>('http://127.0.0.1:3333/archivos',formData).subscribe(res =>{
       console.log(res);
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
       this.http.post<any>('http://127.0.0.1:3333/archivos',formData).subscribe(res =>{
       console.log(res);
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