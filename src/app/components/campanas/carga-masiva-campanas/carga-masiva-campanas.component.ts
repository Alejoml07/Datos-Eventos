import { Component, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { UsuariosService } from 'src/app/shared/service/usuarios.service';

@Component({
  selector: 'app-carga-masiva-campanas',
  templateUrl: './carga-masiva-campanas.component.html',
  styleUrls: ['./carga-masiva-campanas.component.scss']
})
export class CargaMasivaCampanasComponent {
  file: File | null = null;
  mensajeError: string = '';
  secretKey = "3cR#tK3y!9oP$uR3&6Fddsgt493H-o";
  contador = 0;
  jsonData: any[] = [];
  nuevoJson: any[] = [];

  registrado = false;
  error = false;
  estado: boolean = false;
  botonDeshabilitado: boolean = false;
  users: any[];
  progreso = '';
  hasExpectedStructure: boolean = false;
  mensaje: string = '';
  data: any[] = [
    {
      cedula: '',
      nombres: '',
      apellidos: '',
      telefono1: '',
      celular1: '',
      telefono2: '',
      celular2: '',
      correo1: '',
      correo2: '',
      correo3: '',
      fechaNacimiento: '',
      genero: '',
      pais: '',
      departamento: '',
      ciudad: '',
      barrio: '',
      direccion: '',
      nombreEvento: '',
      fechaEvento: '',
      autorizaDatos: ''
    }
  ];
  jsonErrores: any[] = [];
  jsonCorrect: any[] = [];
  productos: any[] = [];
  productosError: any[] = [];

  constructor(
    private router: Router,
    private usuariosService: UsuariosService,
  ) {
    this.users = [];
  }

  ngOnInit() {
  }

  onFileChange(event: any) {
    this.registrado = false;
    this.progreso = '';
    this.file = event.target.files[0];
    const fileReader = new FileReader();

    fileReader.onload = (e: any) => {
      const arrayBuffer = e.target.result;
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      let jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: "" });
      jsonData = jsonData.filter((_, index) => index !== 0);

      console.log('jsonData', jsonData);

      if (Array.isArray(jsonData)) {
        jsonData = jsonData.filter((element) => (
        element.cedula !== ''
        // element.nombres !== '' &&
        // element.apellidos !== '' &&
        // element.celular1 !== '' && 
        // element.nombreEvento !== '' &&
        // element.fechaEvento !== '' &&
        // element.autorizaDatos !== '' &&
        // element.genero !== '' 
      ));

        console.log('Estructura: ', jsonData);

        const expectedFields = ['cedula' ];
        this.hasExpectedStructure = true;
        this.mensaje = '';

        jsonData.forEach((element, index) => {
          expectedFields.forEach((field) => {
            if (!element.hasOwnProperty(field) || element[field] === '' || element[field] === 'No registra') {
              this.hasExpectedStructure = false;
              this.mensaje += `Falta o es inválido el campo ${field} en el registro ${index + 1}. `;
            }
          });
        });

        if (this.hasExpectedStructure) {
          console.log('El arreglo JSON tiene la estructura esperada', jsonData);
        } else {
          console.log('El arreglo JSON no tiene la estructura esperada:', this.mensaje);
        }
      } else {
        console.log('La cadena JSON no es un arreglo');
      }
    };
    if (this.file) {
      fileReader.readAsArrayBuffer(this.file);
    }
  }

  encryptPassword(password: string): string {
    const key = CryptoJS.enc.Utf8.parse(this.secretKey);
    const iv = CryptoJS.enc.Utf8.parse('IVGeneric');

    const encrypted = CryptoJS.AES.encrypt(password, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
  }

  validarObjeto(jsonData: any) {
    const correoRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const numeros = /^[1-9][0-9]*$/;
    console.log('validarData 1', jsonData);
  
    jsonData.forEach((elemento: any) => {
      this.contador = 0;
      this.mensajeError = '';
  
      if (typeof elemento.autorizaDatos !== 'string' && elemento.autorizaDatos < 50) {
        this.mensajeError += ` Autoriza el uso de datos personales `;
        this.contador++;
      }
      if (elemento.cedula && (typeof elemento.cedula !== 'string' || elemento.cedula.length > 300)) {
        this.mensajeError += ' Cédula ';
        this.contador++;
      }
      // if (!numeros.test(elemento.cedula)) {
      //   this.mensajeError += ` Cédula `;
      //   console.log('elemento.cedula', elemento.cedula);
      //   this.contador++;
      // }
      // if (!numeros.test(elemento.celular1)) {
      //   this.mensajeError += ` Celular 1 `;
      //   console.log('elemento.celular1', elemento.celular1);
      //   this.contador++;
      // }
      // if (!correoRegex.test(elemento.correo1)) {
      //   this.mensajeError += ` Correo 1 `;
      //   console.log('elemento.correo1', elemento.correo1);
      //   this.contador++;
      // }
      // if (elemento.empresa && (typeof elemento.empresa !== 'string' || elemento.empresa.length > 300)) {
      //   this.mensajeError += ' Empresa ';
      //   this.contador++;
      // }
      // if (elemento.ciudad && (typeof elemento.ciudad !== 'string' || elemento.ciudad.length > 300)) {
      //   this.mensajeError += ' Ciudad ';
      //   this.contador++;
      // }
      // if (elemento.pais && (typeof elemento.pais !== 'string' || elemento.pais.length > 300)) {
      //   this.mensajeError += ' País ';
      //   this.contador++;
      // }
      // if (elemento.departamento && (typeof elemento.departamento !== 'string' || elemento.departamento.length > 300)) {
      //   this.mensajeError += ' Departamento ';
      //   this.contador++;
      // }
      // if (elemento.nombreEvento && (typeof elemento.nombreEvento !== 'string' || elemento.nombreEvento.length > 300)) {
      //   this.mensajeError += ' nombreEvento ';
      //   this.contador++;
      // }
      // if (elemento.genero && (typeof elemento.genero !== 'string' || elemento.genero.length > 300)) {
      //   this.mensajeError += ' Género ';
      //   this.contador++;
      // }
      // if (elemento.nombres && (typeof elemento.nombres !== 'string' || elemento.nombres.length > 300)) {
      //   this.mensajeError += ' Nombres ';
      //   this.contador++;
      // }
      // if (elemento.apellidos && (typeof elemento.apellidos !== 'string' || elemento.apellidos.length > 300)) {
      //   this.mensajeError += ' Apellidos ';
      //   this.contador++;
      // }
  
      elemento.mensaje = this.mensajeError;
  
      if (this.contador > 0) {
        this.jsonErrores.push(elemento);
      } else {
        this.jsonCorrect.push(elemento);
      }
  
      console.log('errores', this.jsonErrores);
      console.log('correct', this.jsonCorrect);
    });
  }


  downloadExcel(): void {
    window.open("https://stgactincentivos.blob.core.windows.net/$web/FormatoBDEventos%20(3).xlsx?sp=r&st=2024-09-18T18:46:22Z&se=2030-09-19T02:46:22Z&sv=2022-11-02&sr=b&sig=0x6AnpXNc6sa%2FpGwMHR9ddyERBz95pme%2FY%2FGyR7vF1M%3D", "_blank");
  }

  convertToJSON() {
    this.progreso = 'Cargando...';
    if (this.file) {
      const fileReader = new FileReader();
  
      fileReader.onload = (e: any) => {
        const arrayBuffer = e.target.result;
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
  
        let jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: "" });
        jsonData = jsonData.filter((_, index) => index !== 0);
  
        if (Array.isArray(jsonData)) {
          jsonData = jsonData.filter((element) =>
            element.cedula !== '' 
            // element.nombres !== '' &&
            // element.apellidos !== '' &&
            // element.celular1 !== '' &&
            // element.genero !== '' &&
            // element.nombreEvento !== '' &&
            // element.fechaEvento !== '' &&
            // element.autorizaDatos !== ''
          );
  
          if (jsonData.length > 0) {
            this.validarObjeto(jsonData);
            this.productos = this.jsonCorrect;
            this.productosError = this.jsonErrores;
  
            if (this.jsonErrores.length > 0) {
              this.progreso = 'Error';
              this.error = true;
              this.estado = false;
            }
  
            this.nuevoJson = this.jsonCorrect.map((elemento) => ({
              pais: "169",
              cedula: elemento.cedula,
              nombres: elemento.nombres,
              apellidos: elemento.apellidos,
              telefono1: elemento.telefono1 || "No registra",
              celular1: elemento.celular1,
              correo1: elemento.correo1 || "No registra",
              fechaNacimiento: this.transformDate(elemento.fechaNacimiento) || "",
              genero: elemento.genero,
              departamento: elemento.departamento,
              ciudad: elemento.ciudad,
              barrio: elemento.barrio || "No registra",
              direccion: elemento.direccion || "No registra",
              nombreEvento: elemento.nombreEvento || "No registra",
              fechaEvento: this.transformDate(elemento.fechaEvento) || "",
              ciudadEvento: "",
              autorizaUsoDatosPersonales: elemento.autorizaDatos === "Si" ? true : false
            }));
  
            const lotes = this.dividirEnLotes(this.nuevoJson, 2000);
  
            // Iniciar la barra de progreso con SweetAlert2
            let totalLotes = lotes.length;
            let loteProcesado = 0;
  
            Swal.fire({
              title: 'Registrando datos',
              html: 'Procesando los datos <b>0%</b>',
              allowOutsideClick: false,  // Evitar cierre al hacer clic fuera
              showConfirmButton: false,  // No mostrar botón de confirmación
              showCancelButton: false,   // No mostrar botón de cancelación
              timerProgressBar: true,    // Mostrar barra de progreso
              didOpen: () => {
                Swal.showLoading();
              }
            });
  
            this.procesarLotes(lotes, loteProcesado, totalLotes);
          }
        }
      };
  
      fileReader.readAsArrayBuffer(this.file);
    }
  }
  
  dividirEnLotes(array: any[], tamanioLote: number): any[][] {
    const lotes = [];
    for (let i = 0; i < array.length; i += tamanioLote) {
      lotes.push(array.slice(i, i + tamanioLote));
    }
    return lotes;
  }
  
  procesarLotes(lotes: any[][], loteProcesado: number, totalLotes: number) {
    if (loteProcesado < totalLotes) {
      this.usuariosService.registroNuevo(lotes[loteProcesado]).subscribe({
        next: (response) => {
          loteProcesado++;
          const porcentajeProgreso = Math.round((loteProcesado / totalLotes) * 100);
  
          Swal.update({
            html: `Procesando los datos <b>${porcentajeProgreso}%</b>`
          });
  
          // Llamada recursiva para procesar el siguiente lote
          this.procesarLotes(lotes, loteProcesado, totalLotes);
        },
        error: (error) => {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Error en Registro',
            text: `Error en el lote ${loteProcesado + 1}.`
          });
        },
        complete: () => {
          if (loteProcesado === totalLotes) {
            this.registrado = true;
            this.progreso = '';
            this.estado = true;
            Swal.fire({
              icon: 'success',
              title: 'Registro completo',
              text: 'Todos los lotes han sido procesados correctamente.',
              allowOutsideClick: true, // Permitir cierre una vez que el proceso haya terminado
              showConfirmButton: true  // Mostrar botón de confirmación al finalizar
            });
          }
        }
      });
    }
  }

  transformDate(fecha: string): string {
    console.log('fecha', fecha);
    const partes = fecha.split('/');
    if (partes.length === 3) {
      const mes = partes[0].padStart(2, '0');
      const dia = partes[1].padStart(2, '0');
      const anio = partes[2].length === 2 ? '20' + partes[2] : partes[2];
      return `${anio}-${mes}-${dia}T00:00:00`;
    }
    return "";
  }
  

  convertToExcel() {
    this.jsonErrores.forEach((obj) => {
      if (obj.hasOwnProperty('mensaje')) {
        delete obj['mensaje']; 
      }
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.jsonErrores);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DataSheet');
    XLSX.writeFile(wb, 'UsuarioError.xlsx');
  }

}
