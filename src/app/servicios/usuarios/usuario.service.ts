import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Usuario } from 'src/app/modelos/Usuario';
import Ws from '@adonisjs/websocket-client';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
      ws.connect();
      const canal = ws.subscribe('usuarios');
      canal.on('ready', () => {
        console.log('Suscripcion Usuarios');
      })
      // cuando reciba una actualización, lo mandará a la lista de usuarios
      canal.on('actualizar', (usuarios) => {
        console.log("Actualiza Usuarios Socket")
        this.actualizarUsuarios(usuarios);
      })
    }
    catch(e){console.log('Ya Conectado')}
  }

  cerrarConexion(){
    try{
      ws.getSubscription('usuarios').close();
      console.log('Desconectar Socket')
    }
    catch(e){console.log('No Hay Conexion')}
  }

  actualizarUsuarios(usuarios){
    this.usuarios.next(usuarios);
  }

  enviarUsuarios(usuarios){
    console.log("Enviar Usuarios Socket")
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
      console.error('Ocurrió un error: ', error.error.message);
      alert('Perdida de conexion');
    } else {
      console.error('Código de respuesta del servidor \nServer Response Status '+error.status +'\nMensage de error '+ error.message);
      alert('Error de estructura de Respuesta o datos enviados');
    }
    return throwError('Algó salió mal; intenta de nuevo más tarde.');
  }


}

