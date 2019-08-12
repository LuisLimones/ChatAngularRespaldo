import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/servicios/usuarios/usuario.service';

@Component({
  selector: 'app-registrarusuario',
  templateUrl: './registrarusuario.component.html',
  styleUrls: ['./registrarusuario.component.css']
})
export class RegistrarusuarioComponent implements OnInit, OnDestroy {
  public formcrearusuario: FormGroup;
  public builder = new FormBuilder();
  public datos = {};

  constructor(private router:Router, private usuarioService: UsuarioService) {
    this.formcrearusuario = this.builder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required]]
    });
   }

   ngOnInit() {
    this.usuarioService.conectar()
  }
  ngOnDestroy(): void {
    this.usuarioService.cerrarConexion();
  }

  public registrar(){
    try {
      this.datos = JSON.stringify({
        username: this.formcrearusuario.value.username,
        password: this.formcrearusuario.value.password,
        email:this.formcrearusuario.value.email});
        this.usuarioService.registrarUsuario(this.datos).subscribe(usuarios=>{
        this.formcrearusuario.reset();
        this.router.navigate(['/login']);
      });
    } catch (error) {
      alert('El Usuario Ya Existe');
    }
    
  }

}
