import { Routes } from '@angular/router';


export const content: Routes = [
 

  {
    path: 'coupons',
    loadChildren: () => import('../../components/coupons/coupons.module').then(m => m.CouponsModule),
    data: {
      breadcrumb: "Coupons"
    }
  },
  {
    path: 'pagina',
    loadChildren: () => import('../../components/gestor-contenido/gestor-contenido.module').then(m => m.GestorContenidoModule),
    data: {
      breadcrumb: "Coupons"
    }
  },
  {
    path: 'vistas',
    loadChildren: () => import('../../components/vistas-pagina/vistas-pagina.module').then(m => m.VistasPaginaModule),
    data: {
      breadcrumb: "Coupons"
    }
  },
  {
    path: 'datos',
    loadChildren: () => import('../../components/campanas/campanas.module').then(m => m.CampanasModule),
    data: {
      breadcrumb: "Datos"
    }
  },
 

 
 
  
 



  
];