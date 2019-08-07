import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPopper } from 'angular-popper';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

// componentes del chat
import { PaginaPrincipalComponent } from './componentes/pagina-principal/pagina-principal.component';
import { ChatComponent } from './componentes/chat/chat.component';
import { ChatsComponent } from './componentes/chats/chats.component';
import { CrearusuarioComponent } from './componentes/crearusuario/crearusuario.component';
import { LoginComponent } from './componentes/login/login.component';
import { CrearGrupoComponent } from './componentes/crear-grupo/crear-grupo.component';



@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    ChatsComponent,
    CrearusuarioComponent,
    PaginaPrincipalComponent,
    LoginComponent,
    CrearGrupoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPopper,
    FormsModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

