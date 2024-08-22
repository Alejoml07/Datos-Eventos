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

      let jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: "No registra" });
      jsonData = jsonData.filter((_, index) => index !== 0);

      if (Array.isArray(jsonData)) {
        jsonData = jsonData.filter((element) => (element.cedula !== '' && 
        element.nombres !== '' &&
        element.apellidos !== '' &&
        element.celular1 !== '' && 
        element.genero !== '') && 
        (element.cedula !== 'No registra' && 
        element.nombres !== 'No registra' && 
        element.apellidos !== 'No registra' && 
        element.celular1 !== 'No registra' && 
        element.ciudad !== 'No registra' && 
        element.departamento !== 'No registra' && 
        element.genero !== 'No registra'));
        console.log('Estructura: ', jsonData);

        const expectedFields = [
          'cedula', 'nombres', 'apellidos', 'telefono1', 'celular1', 
          'correo1', 'fechaNacimiento', 'genero'];
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
          console.log('El arreglo JSON tiene la estructura esperada');
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
      if (!numeros.test(elemento.cedula)) {
        this.mensajeError += ` Cédula `;
        console.log('elemento.cedula', elemento.cedula);
        this.contador++;
      }
      if (!numeros.test(elemento.celular1)) {
        this.mensajeError += ` Celular 1 `;
        console.log('elemento.celular1', elemento.celular1);
        this.contador++;
      }
      if (!correoRegex.test(elemento.correo1)) {
        this.mensajeError += ` Correo 1 `;
        console.log('elemento.correo1', elemento.correo1);
        this.contador++;
      }
      if (elemento.empresa && (typeof elemento.empresa !== 'string' || elemento.empresa.length > 300)) {
        this.mensajeError += ' Empresa ';
        this.contador++;
      }
      if (elemento.ciudad && (typeof elemento.ciudad !== 'string' || elemento.ciudad.length > 300)) {
        this.mensajeError += ' Ciudad ';
        this.contador++;
      }
      if (elemento.departamento && (typeof elemento.departamento !== 'string' || elemento.departamento.length > 300)) {
        this.mensajeError += ' Departamento ';
        this.contador++;
      }
      if (elemento.genero && (typeof elemento.genero !== 'string' || elemento.genero.length > 300)) {
        this.mensajeError += ' Género ';
        this.contador++;
      }
      if (elemento.nombres && (typeof elemento.nombres !== 'string' || elemento.nombres.length > 300)) {
        this.mensajeError += ' Nombres ';
        this.contador++;
      }
      if (elemento.apellidos && (typeof elemento.apellidos !== 'string' || elemento.apellidos.length > 300)) {
        this.mensajeError += ' Apellidos ';
        this.contador++;
      }
  
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
    window.open("https://stgactincentivos.blob.core.windows.net/$web/FormatoUsuario.xlsx?sp=r&st=2024-07-08T16:12:07Z&se=2030-07-09T00:12:07Z&sv=2022-11-02&sr=b&sig=uqzoBBQNeq68VvYj5zW8bMBCDggpPWFU2cqVBuAEScQ%3D", "_blank");
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
  
        let jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: "No registra" });
  
        if (Array.isArray(jsonData)) {
          jsonData = jsonData.filter((element) => 
            element.cedula !== '' && 
            element.nombres !== '' &&
            element.apellidos !== '' &&
            element.celular1 !== '' && 
            element.genero !== '' &&
            element.cedula !== 'No registra' && 
            element.nombres !== 'No registra' && 
            element.apellidos !== 'No registra' && 
            element.celular1 !== 'No registra' && 
            element.ciudad !== 'No registra' && 
            element.departamento !== 'No registra' && 
            element.genero !== 'No registra'
          );
  
          if (jsonData.length > 0) {
            this.validarObjeto(jsonData);
            this.productos = this.jsonCorrect;
            this.productosError = this.jsonErrores;
  
            // Si se encuentran errores
            if (this.jsonErrores.length > 0) {
              this.progreso = 'Error';
              this.error = true;
              this.estado = false;
            }
  
            // Iterar sobre jsonCorrect en lugar de jsonData
            this.nuevoJson = this.jsonCorrect.map((elemento) => ({
              pais: "169",
              cedula: elemento.cedula,
              nombres: elemento.nombres,
              apellidos: elemento.apellidos,
              telefono1: elemento.telefono1 || "No registra",
              celular1: elemento.celular1,
              correo1: elemento.correo1 || "No registra",
              fechaNacimiento: this.transformDate(elemento.fechaNacimiento), // Función para transformar fecha
              genero: elemento.genero,
              departamento: elemento.departamento,
              ciudad: elemento.ciudad,
              barrio: elemento.barrio || "No registra",
              direccion: elemento.direccion || "No registra",
              nombreEvento: elemento.nombreEvento || "No registra",
              fechaEvento: this.transformDate(elemento.fechaEvento)|| "No registra",
              ciudadEvento: "", 
              autorizaUsoDatosPersonales: elemento.autorizaDatos === "Si" ? true : false
            }));
            console.log('datos para la api', JSON.stringify(this.jsonCorrect));
            console.log('datos para la api', JSON.stringify(this.nuevoJson));
          }

           this.usuariosService.registroNuevo(this.nuevoJson).subscribe({
            next: (response) => {
              if (response) {
                this.registrado = true;
                this.progreso = '';
                this.estado = true;
                Swal.fire({
                  icon: 'success',
                  title: 'Registrados',
                  text: 'Todos los registros guardados exitosamente.'
                });
              } else {
                this.error = true;
                this.progreso = '';
                Swal.fire({
                  icon: 'error',
                  title: 'Error en Registro',
                  text: 'Ocurrió un error al registrar.'
                });
              }
            },
            error: (error) => {
              console.error(error);
              this.progreso = '';
              Swal.fire({
                icon: 'error',
                title: 'Error en Registro',
                text: 'Ocurrió un error al registrar los usuarios.'
              });
            }
          });

        }
      };
  
      fileReader.readAsArrayBuffer(this.file);
    }
  }

  transformDate(fecha: string): string {
    const partes = fecha.split('/');
    if (partes.length === 3) {
      const dia = partes[0].padStart(2, '0');
      const mes = partes[1].padStart(2, '0');
      const anio = partes[2].length === 2 ? '20' + partes[2] : partes[2];
      return `${anio}-${mes}-${dia}T00:00:00`;
    }
    return "No registra";
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
