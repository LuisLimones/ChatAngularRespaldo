import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Chatangular';
public showiniciar:boolean;
public showcerrar:boolean;


  
sesion(): boolean{
  if(localStorage.getItem('token')){
    return true;
  }else{
    return false;
  }
}

salir(){
  localStorage.removeItem('token');
  localStorage.removeItem('id');
  localStorage.removeItem('username');
  this.router.navigate(['login']);
}



  constructor(private router:Router){
  
  }
}
