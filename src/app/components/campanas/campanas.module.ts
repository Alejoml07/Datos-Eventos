import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampanasRoutingModule } from './campanas-routing.module';
import { CargaMasivaCampanasComponent } from './carga-masiva-campanas/carga-masiva-campanas.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    CargaMasivaCampanasComponent
  ],
  imports: [
    CommonModule,
    CampanasRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule

  ]
})
export class CampanasModule { }
