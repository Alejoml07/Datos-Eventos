import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaPlantilla1Component } from './vista-plantilla-1.component';

describe('VistaPlantilla1Component', () => {
  let component: VistaPlantilla1Component;
  let fixture: ComponentFixture<VistaPlantilla1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaPlantilla1Component]
    });
    fixture = TestBed.createComponent(VistaPlantilla1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
