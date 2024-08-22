import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from 'src/app/shared/guards/auth.guard';
import { CargaMasivaCampanasComponent } from './carga-masiva-campanas/carga-masiva-campanas.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-coupons',
        // component: ListCouponComponent,
        data: {
          title: "Bonos",
          breadcrumb: "Bonos"
        },
        canActivate: [authGuard]

      },
      {
        path: 'carga-masiva',
        component: CargaMasivaCampanasComponent,
        data: {
          title: "Carga masiva",
          breadcrumb: "Carga masiva"
        },
        canActivate: [authGuard]

      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampanasRoutingModule { }
