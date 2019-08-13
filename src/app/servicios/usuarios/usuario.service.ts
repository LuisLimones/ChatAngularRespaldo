import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Usuario } from 'src/app/modelos/Usuario';
import Ws from '@adonisjs/websocket-client';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { servidorURL } from 'src/app/globales/Globales';
import { wsURL } from 'src/app/globales/Globales';


const ws = Ws(wsURL);

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private usuarios = new BehaviorSubject([]);
  lista_usuarios = this.usuarios.asObservable();

  constructor(private request: HttpClient) { }

  httpOptions={
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  conectar(){
    try{
      ws.connect();
      const canal = ws.subscribe('usuarios');
      canal.on('ready', () => {
        console.log('Suscripcion Usuarios');
      })
      canal.on('actualizar', (usuarios) => {
        this.actualizarUsuarios(usuarios);
      })
    }
    catch(e){
      console.log('Ya Conectado ' + e)
    }
  }

  cerrarConexion(){
    try{
      ws.getSubscription('usuarios').close();
    }
    catch(e){
      console.log('No Hay Conexion ' + e)
    }
  }

  actualizarUsuarios(usuarios){
    this.usuarios.next(usuarios);
  }

  enviarUsuarios(usuarios){
    ws.getSubscription('usuarios').emit('actualizar',usuarios);
  }

  url: string = servidorURL;
  obtenerUsuarios(): Observable<Usuario[]>{
    return this.request.get<Usuario[]>(this.url +'obtener-usuarios', this.httpOptions);
  }

  registrarUsuario(json: any){
    return this.request.post(this.url + 'registrar-usuario', json, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  //Login
  public getData(url: string) {
    return this.request.get(url);
  }

  public postData(url: string, json: any) {
    return this.request.post(url, json, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Ocurrió un error: ', error.error.message);
      alert('Conexion Perdida');
    } else {
      if(error.status==404){
        console.error('Server Response Status '+error.status +'\nMensage de error '+ error.message);
        alert('Usuario O Contraseña Invalidos');
      }
      if(error.status==400){
        alert("Usuario Ya Registrado")
      }
    }
    return throwError('Error Interno\nIntente Mas Tarde');
  }


}

