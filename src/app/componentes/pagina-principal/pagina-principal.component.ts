import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-pagina-principal',
  templateUrl: './pagina-principal.component.html',
  styleUrls: ['./pagina-principal.component.css']
})
export class PaginaPrincipalComponent implements OnInit {

  constructor(public ruter: Router) { }

  nombre_usuario: string;
  ngOnInit() {
    this.nombre_usuario = localStorage.getItem('username');
  }

  crearusuario(){
    this.ruter.navigate(['registrar']);
  }

  login(){
    this.ruter.navigate(['login']);
  }
  salir(){
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('username');
    this.ruter.navigate(['login']);
  }
}
