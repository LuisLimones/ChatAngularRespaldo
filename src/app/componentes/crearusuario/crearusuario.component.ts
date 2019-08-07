import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/servicios/usuarios/usuario.service';

@Component({
  selector: 'app-crearusuario',
  templateUrl: './crearusuario.component.html',
  styleUrls: ['./crearusuario.component.css']
})
export class CrearusuarioComponent implements OnInit, OnDestroy {

  public formcrearusuario: FormGroup;
  public builder = new FormBuilder();
  public json = {};


  constructor( private router:Router, private usuarioService: UsuarioService) {
    this.formcrearusuario = this.builder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required,Validators.email]]
    });
  }

  ngOnInit() {
    this.usuarioService.conectar()
  }
  ngOnDestroy(): void {
    this.usuarioService.cerrarConexion();
  }

  public registrar(){
    console.log("registrar");
    this.json = JSON.stringify({
      username: this.formcrearusuario.value.username,
      password: this.formcrearusuario.value.password,
      email:this.formcrearusuario.value.email});
      console.log(this.json);

      this.usuarioService.registrarUsuario(this.json).subscribe(usuarios=>{
      // this.usuarioService.enviarUsuarios(usuarios);
      // console.log('usuarios re-enviados')
      this.formcrearusuario.reset();
      this.router.navigate(['/login']);
    });
  }
}
