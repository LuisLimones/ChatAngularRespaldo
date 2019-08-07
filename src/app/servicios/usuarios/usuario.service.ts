import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Usuario } from 'src/app/modelos/Usuario';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


import Ws from '@adonisjs/websocket-client';
// la variable ws la ruta para conectarse al socket
const ws = Ws('ws://127.0.0.1:3333')

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  // aqui se guarda la lista de los usuarios que se traen desde el socket
  private usuarios = new BehaviorSubject([]);
  lista_usuarios = this.usuarios.asObservable();

  constructor(private request: HttpClient) { }

  conectar(){
    try{
      // generamos la conexión al socket
      ws.connect();
      const canal = ws.subscribe('usuarios')

      // éste método se ejecutará cuando la conexión al canal chat esté lista.
      canal.on('ready', () => {
        console.log('** suscripción al canal usuarios lista');
      })
      // cuando reciba una actualización, lo mandará a la lista de usuarios
      canal.on('actualizar', (usuarios) => {
        console.log("** usuarios recibidos del ws")
        this.actualizarUsuarios(usuarios);
      })
    }
    catch(e){console.log('ya está conectado')}
  }

  cerrarConexion(){
    try{
      ws.getSubscription('usuarios').close();
      console.log('desconectado del socket usuarios')
    }
    catch(e){console.log('no hay conexion para cerrar')}
  }

  actualizarUsuarios(usuarios){
    this.usuarios.next(usuarios);
  }

  enviarUsuarios(usuarios){
    console.log("** Enviando usuarios")
    ws.getSubscription('usuarios').emit('actualizar',usuarios);
  }

  // métodos relacionados a los usuarios
  url: string = 'http://127.0.0.1:3333/';
  obtenerUsuarios(): Observable<Usuario[]>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.request.get<Usuario[]>(this.url +'obtener-usuarios', {headers:headers});
  }

  registrarUsuario(json: any){
    console.log("llega reg usuario usuarioservice");
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.request.post(this.url + 'registrar-usuario', json, {headers:headers});
  }

  //metodos para login
  public getData(url: string) {
    return this.request.get(url);
  }

  public postData(url: string, json: any,header: HttpHeaders) {
    return this.request.post(url, json, { 'headers': header }).pipe(
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('Ocurrió un error: ', error.error.message);
      alert('Perdida de conexion');
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      
      console.error('Código de respuesta del servidor \nServer Response Status '+error.status +'\nMensage de error '+ error.message);
      alert('Error de estructura de Respuesta o datos enviados');
    }
      // return an observable with a user-facing error message
    return throwError('Algó salió mal; intenta de nuevo más tarde.');
  }


}

