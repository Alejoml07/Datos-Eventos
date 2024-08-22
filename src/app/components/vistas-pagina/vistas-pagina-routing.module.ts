import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaPlantilla1Component } from './vista-plantilla-1/vista-plantilla-1.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'plantilla-1',
        component: VistaPlantilla1Component,
        data: {
          title: "Gestor de contenido",
          breadcrumb: "Gestor de contenido"
        },

      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VistasPaginaRoutingModule { }
