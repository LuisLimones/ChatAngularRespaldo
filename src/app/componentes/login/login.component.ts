import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/servicios/usuarios/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public login: FormGroup;
  public builder = new FormBuilder();
  public  cuerpo={};


  constructor(private servicio: UsuarioService, private router:Router ) {
    this.login = this.builder.group({
      username:['',Validators.required],
      password:['',Validators.required]
    });
   }

  ngOnInit() {
  }

  crearusuario(){
    this.router.navigate(['registrar'])
  }

  logearte(){
    const url = 'http://127.0.0.1:3333/login';
    const Headers =new HttpHeaders().set('Content-type','application/json');
    this.cuerpo = JSON.stringify({username: this.login.value.username,password:this.login.value.password});

    return this.servicio.postData(url,this.cuerpo,Headers).subscribe((response) =>{
      let usuario=JSON.stringify(response);
      let us = JSON.parse(usuario);
      localStorage.setItem('token', us.token)
      localStorage.setItem('id',us.id)
      localStorage.setItem('username',us.username)
      this.router.navigate(['chats']);
    })
  }
}
