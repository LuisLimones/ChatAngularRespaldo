import { Injectable } from '@angular/core';
import Ws from '@adonisjs/websocket-client';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Conversacion } from 'src/app/modelos/Conversacion';
import { Mensaje } from 'src/app/modelos/Mensaje';
import { Usuario } from 'src/app/modelos/Usuario';
import { servidorURL } from 'src/app/globales/Globales';
import { wsURL } from 'src/app/globales/Globales';

const ws = Ws(wsURL);

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  usuarios = new BehaviorSubject([]);

  private mensajes = new BehaviorSubject([]);
  mensajesActuales = this.mensajes.asObservable();

  constructor(private request: HttpClient) {
    let u = new Usuario;
    u.id = 0;
    this.usuarios.next([u,u])
  }
  httpOptions={
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  private id_chat: number;
  conectar(id_chat: number){
    try{
      this.id_chat = id_chat;
      ws.connect();
      const chat = ws.subscribe('chat:'+id_chat)
      chat.on('ready', () => {
        console.log('Conexion Lista');
      })
      chat.on('actualizar', (mensajes) => {
        this.actualizarMensajes(mensajes);
      })
    }
    catch(e){
      console.log('Conexion Duplicada' + e)
    }
  }

  cerrarConexion(){
    try{
      ws.getSubscription('chat:'+this.id_chat).close();
    }
    catch(e){
      console.log('Conexion Inexistente '+ e);
    }
  }

  actualizarMensajes(mensajes){
    this.mensajes.next(mensajes);
  }

  enviarMensajes(mensajes){
    try{
      ws.getSubscription('chat:'+this.id_chat).emit('actualizar', mensajes);
    }
    catch(e){ 
      console.log(e); 
    }
  }

  cambiarUsuarios(nuevos_usuarios: Array<any>){
    this.usuarios.next(nuevos_usuarios);
  }

  url: string = servidorURL;

  registrarChat(){
    return this.request.post<any>(this.url +'reg-chat', this.httpOptions);
  }

  registrarConversacion(json){
    return this.request.post<any>(this.url +'iniciar-conversacion', json, this.httpOptions);
  }

  enviarMensaje(json): Observable<Mensaje[]>{
    return this.request.post<Mensaje[]>(this.url +'enviar-mensaje', json, this.httpOptions);
  }

  obtenerConversacion(json): Observable<Conversacion>{
    return this.request.post<Conversacion>(this.url +'obtener-conversacion', json, this.httpOptions);
  }

  obtenerGrupos(json): Observable<Conversacion[]>{
    return this.request.post<Conversacion[]>(this.url +'obtener-grupos', json, this.httpOptions);
  }

  uEscribiendo(){
    try{
      ws.getSubscription('chat:'+this.id_chat).emit('escribiendo');
    }
    catch(e){ 
      console.log(e); 
    }
  }
  getSocket(): Ws{
    try{
     return ws.getSubscription('chat:'+this.id_chat);
    }
    catch(e){ 
      console.log(e); 
    }
  }
}
