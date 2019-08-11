import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';

// componentes del chat
import { PaginaPrincipalComponent } from './componentes/pagina-principal/pagina-principal.component';
import { GrupoComponent } from './componentes/grupo/grupo.component';
import { RegistrarusuarioComponent } from './componentes/registrarusuario/registrarusuario.component';
import { LoginComponent } from './componentes/login/login.component';
import { LoginGuard } from './guards/login.guard';
import { AuthGuard } from './guards/auth.guard';
import { NoauthGuard } from './guards/noauth.guard';
import { ChatsComponent } from './componentes/chats/chats.component';
import { ChatComponent } from './componentes/chat/chat.component';


const routes: Routes = [
  {path: '', component: PaginaPrincipalComponent },
  {path: 'login', component:LoginComponent, canActivate:[LoginGuard]},
  {path: 'chats', component: ChatsComponent, canActivate:[AuthGuard]},
  {path: 'chatear', component: ChatComponent, canActivate:[AuthGuard]},
  {path: 'registrar', component: RegistrarusuarioComponent, canActivate:[NoauthGuard]},
  {path: 'crear-grupo', component: GrupoComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: "" }
 
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
