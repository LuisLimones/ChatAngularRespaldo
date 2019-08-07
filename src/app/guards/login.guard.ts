import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate  {
  path: ActivatedRouteSnapshot[];
  route: ActivatedRouteSnapshot;

  constructor(private router:Router){}
   canActivate(route:ActivatedRouteSnapshot,state: RouterStateSnapshot){
     if(localStorage.getItem('token')){
       this.router.navigate(['chats'])
       return false;
     }
     return true;

   }
  
}
