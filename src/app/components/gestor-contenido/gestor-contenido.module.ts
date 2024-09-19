import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestorContenidoRoutingModule } from './gestor-contenido-routing.module';
import { GestorPaginaComponent } from './gestor-pagina/gestor-pagina.component';
import { VistasPaginaModule } from '../vistas-pagina/vistas-pagina.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    GestorPaginaComponent
  ],
  imports: [
    CommonModule,
    GestorContenidoRoutingModule,
    VistasPaginaModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class GestorContenidoModule { }
