import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { SecurityService } from 'src/app/shared/service/security.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-create-coupon',
  templateUrl: './create-coupon.component.html',
  styleUrls: ['./create-coupon.component.scss']
})
export class CreateCouponComponent implements OnInit {
  
  bonosForm: FormGroup;
  bonosList: any[] = [];
  user: any;
  bonosFromApi: any;
  valorDenominacionInicial: number;
  valorDenominacionFinal: number;

  constructor(private fb: FormBuilder, private securityService: SecurityService) {
    this.bonosForm = this.fb.group({
      valorBonos: ['', [Validators.required, this.currencyValidator.bind(this)]],
      cantidadBonos: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      observacion: ['']
    });
  }

  ngOnInit() {
    this.loadBonosFromLocalStorage();
    this.user = this.securityService.getUserAuthenticated();
    this.get(); // Llamado automático a get() al cargar la página
  }

  validateQuantity(event: any) {
    let input = event.target.value.replace(/\D/g, '');
    if (input.length > 4) {
      input = input.slice(0, 4);
    }
    event.target.value = input;
    this.bonosForm.controls['cantidadBonos'].setValue(input, { emitEvent: false });
  }

  formatCurrency(event: any) {
    let input = event.target.value.replace(/[\D\s\._\-]+/g, "");
    input = input ? parseInt(input, 10) : 0;

    let formattedInput = input.toLocaleString("es-ES");
    event.target.value = `$${formattedInput}`;
    this.bonosForm.controls['valorBonos'].setValue(event.target.value, { emitEvent: false });
    this.bonosForm.controls['valorBonos'].updateValueAndValidity(); // Trigger validation
  }

  deleteBono(index: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se eliminarán los bonos permanentemente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.bonosList.splice(index, 1);
        this.saveBonosToLocalStorage();
      }
    });
  }

  addBono() {
    if (this.bonosForm.valid) {
      this.bonosList.push(this.bonosForm.value);
      this.saveBonosToLocalStorage();
      this.resetForm();
      Swal.fire('Bono agregado con éxito', '', 'success');
    } else {
      Swal.fire('Error al agregar bono', '', 'error');
    }
  }

  resetForm() {
    this.bonosForm.reset();
  }

  saveBonosToLocalStorage() {
    localStorage.setItem('bonosList', JSON.stringify(this.bonosList));
  }

  loadBonosFromLocalStorage() {
    const storedBonos = localStorage.getItem('bonosList');
    if (storedBonos) {
      this.bonosList = JSON.parse(storedBonos);
    }
  }

  downloadExcel() {
    const worksheet = XLSX.utils.json_to_sheet(this.bonosList);
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    // this.saveAsExcelFile(excelBuffer, 'bonos');
  }

  printLocalStorage() {
    const storedBonos = localStorage.getItem('bonosList');
    const user = this.securityService.getUserAuthenticated();
    console.log('user abajo ',user)
  
    if (storedBonos) {
      const bonosList = JSON.parse(storedBonos);
  
      const jsonPayload = {
        usuario: user.nombreEmpresa, 
        observaciones: '',
        enviarCorreo: 0, 
        cliente: {
          nit: user.nitEmpresa, 
          nombre: user.nombreEmpresa, 
          celular: 0 
        },
        bonos: bonosList.map((bono: any) => {
          const cleanDenomination = bono.valorBonos.replace(/\$/g, '').replace(/\./g, '').trim();
          return {
            correo: bono.correo,
            denominacion: cleanDenomination,
            isCustomDenomination: true,
            de: user.nombreEmpresa, 
            para: bono.correo,
            cantidad: bono.cantidadBonos
          };
        })
      };
  
      console.log(JSON.stringify(jsonPayload, null, 2));
  
      // Aquí puedes agregar la lógica para enviar el JSON a la API, por ejemplo:
      this.securityService.addBonos(jsonPayload).subscribe(
        (response: any) => {
          console.log('response',response)
          Swal.fire('Éxito', 'Estado de garantía enviado exitosamente', 'success');
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  
    } else {
      console.log('No hay datos en el local storage');
    }
  }

  get() {
    const user = this.securityService.getUserAuthenticated();
    console.log('user abajo', user);
  
    const data = {
      "accion": "L"
    }
  
    this.securityService.getBonos(data).subscribe(
      (response: any) => {
        console.log('response', response);
        const parsedResponse = JSON.parse(response.result); // Parsear el JSON anidado
        this.bonosFromApi = parsedResponse.bonos; // Almacenar los bonos obtenidos de la API
        this.valorDenominacionInicial = parsedResponse.valorDenominacionInicial; // Almacenar valorDenominacionInicial
        this.valorDenominacionFinal = parsedResponse.valorDenominacionFinal; // Almacenar valorDenominacionFinal
        console.log("inicial", this.valorDenominacionInicial)
        console.log("final", this.valorDenominacionFinal)
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  currencyValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value.replace(/[\D\s\._\-]+/g, "");
    const numericValue = value ? parseInt(value, 10) : 0;
    if (numericValue < this.valorDenominacionInicial) {
      return { min: true };
    }
    if (numericValue > this.valorDenominacionFinal) {
      return { max: true };
    }
    return null;
  }
}