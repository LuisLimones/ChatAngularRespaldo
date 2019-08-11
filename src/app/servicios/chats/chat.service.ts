import { Injectable } from '@angular/core';
import Ws from '@adonisjs/websocket-client';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Conversacion } from 'src/app/modelos/Conversacion';
import { Mensaje } from 'src/app/modelos/Mensaje';
import { Usuario } from 'src/app/modelos/Usuario';

const ws = Ws('ws://127.0.0.1:3333')

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  // aqui se guarda el usuario seleccionado para mostrar el chat
  usuarios = new BehaviorSubject([]);

  // esta es la conversacion
  private mensajes = new BehaviorSubject([]);
  mensajesActuales = this.mensajes.asObservable();

  constructor(private request: HttpClient) {
    // inicializamos los usuarios seleccionados para poder usar en los chats
    let u = new Usuario;
    u.id = 0;
    this.usuarios.next([u,u])
  }

  private id_chat: number;
  conectar(id_chat: number){
    try{
      this.id_chat = id_chat;
      // generamos la conexión al socket
      ws.connect();
      const chat = ws.subscribe('chat:'+id_chat)
      console.log('conectando al chat ' +id_chat)
      
      // éste método se ejecutará cuando la conexión al canal chat esté lista.
      chat.on('ready', () => {
        console.log('la conexion del socket está lista');
      })
      chat.on('actualizar', (mensajes) => {
        console.log('-- mensajes actualizados')
        this.actualizarMensajes(mensajes);
      })
    }
    catch(e){console.log('ya está conectado')}
  }

  cerrarConexion(){
    try{
      ws.getSubscription('chat:'+this.id_chat).close();
      console.log('desconectado del chat '+this.id_chat)
    }
    catch(e){console.log('no hay conexion para cerrar')}
  }

  actualizarMensajes(mensajes){
    this.mensajes.next(mensajes);
  }

  enviarMensajes(mensajes){
    try{
      ws.getSubscription('chat:'+this.id_chat).emit('actualizar', mensajes);
    }catch(e){ console.log(e); }
  }

  cambiarUsuarios(nuevos_usuarios: Array<any>){
    console.log('-- antiguos nuevos_usuarios')
    console.log(nuevos_usuarios)
    this.usuarios.next(nuevos_usuarios);
    console.log('-- nuevos nuevos_usuarios')
    console.log(this.usuarios)
  }

  url: string = 'http://127.0.0.1:3333/';
  registrarChat(){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.request.post<any>(this.url +'reg-chat', {headers:headers});
  }

  registrarConversacion(json){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.request.post<any>(this.url +'iniciar-conversacion', json, {headers:headers});
  }

  enviarMensaje(json): Observable<Mensaje[]>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.request.post<Mensaje[]>(this.url +'enviar-mensaje', json, {headers:headers});
  }

  obtenerConversacion(json): Observable<Conversacion>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.request.post<Conversacion>(this.url +'obtener-conversacion', json, {headers:headers});
  }

  obtenerGrupos(json): Observable<Conversacion[]>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.request.post<Conversacion[]>(this.url +'obtener-grupos', json, {headers:headers});
  }

  uEscribiendo(){
    try{
      ws.getSubscription('chat:'+this.id_chat).emit('escribiendo');
    }catch(e){ console.log(e); }
  }
  getSocket(): Ws{
    try{
     return ws.getSubscription('chat:'+this.id_chat);
    }catch(e){ console.log(e); }
  }
}
