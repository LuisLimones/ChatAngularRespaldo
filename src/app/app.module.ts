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
import { LoginComponent } from './componentes/login/login.component';
import { GrupoComponent } from './componentes/grupo/grupo.component';
import { RegistrarusuarioComponent } from './componentes/registrarusuario/registrarusuario.component';



@NgModule({
  declarations: [
    AppComponent,
    GrupoComponent,
    RegistrarusuarioComponent,
    ChatComponent,
    ChatsComponent,
    PaginaPrincipalComponent,
    LoginComponent
    
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

