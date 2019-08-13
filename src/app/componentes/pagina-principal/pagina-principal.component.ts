import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-pagina-principal',
  templateUrl: './pagina-principal.component.html',
  styleUrls: ['./pagina-principal.component.css']
})
export class PaginaPrincipalComponent implements OnInit {

  constructor(public router: Router) { }

  nombre_usuario: string;
  ngOnInit() {
    this.nombre_usuario = localStorage.getItem('username');
    if(localStorage.getItem('token')){
      this.router.navigate(['chats']);
    }
  }

  crearusuario(){
    this.router.navigate(['registrar']);
  }

  login(){
    this.router.navigate(['login']);
  }
  salir(){
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('username');
    this.router.navigate(['login']);
  }
}
