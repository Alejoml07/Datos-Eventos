import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VistasPaginaRoutingModule } from './vistas-pagina-routing.module';
import { VistaPlantilla1Component } from './vista-plantilla-1/vista-plantilla-1.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    VistaPlantilla1Component
  ],
  exports: [
    VistaPlantilla1Component
  ],
  imports: [
    CommonModule,
    VistasPaginaRoutingModule,
    ReactiveFormsModule

  ]
})
export class VistasPaginaModule { }
