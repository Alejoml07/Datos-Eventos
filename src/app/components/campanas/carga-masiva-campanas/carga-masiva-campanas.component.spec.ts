import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaMasivaCampanasComponent } from './carga-masiva-campanas.component';

describe('CargaMasivaCampanasComponent', () => {
  let component: CargaMasivaCampanasComponent;
  let fixture: ComponentFixture<CargaMasivaCampanasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CargaMasivaCampanasComponent]
    });
    fixture = TestBed.createComponent(CargaMasivaCampanasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
