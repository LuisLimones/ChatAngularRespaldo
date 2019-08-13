import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/servicios/usuarios/usuario.service';
import { servidorURL } from 'src/app/globales/Globales';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public login: FormGroup;
  public builder = new FormBuilder();
  public  cuerpo={};


  constructor(private usuarioService: UsuarioService, private router:Router ) {
    this.login = this.builder.group({
      username:['',Validators.required],
      password:['',Validators.required]
    });
   }

  ngOnInit() {
    if(localStorage.getItem('token')){
      this.router.navigate(['chats']);
    }
  }

  crearusuario(){
    this.router.navigate(['registrar'])
  }

  logearte(){
    const url = servidorURL+'login';
    this.cuerpo = JSON.stringify({username: this.login.value.username, password: this.login.value.password});

    return this.usuarioService.postData(url,this.cuerpo).subscribe((response) =>{
      let usuario=JSON.stringify(response);
      let us = JSON.parse(usuario);
      localStorage.setItem('token', us.token)
      localStorage.setItem('id',us.id)
      localStorage.setItem('username',us.username)
      this.router.navigate(['chats']);
    })
  }
}
