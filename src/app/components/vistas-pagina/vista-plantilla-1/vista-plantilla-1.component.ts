import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/app/shared/service/storage.service';
import { UsuariosService } from 'src/app/shared/service/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vista-plantilla-1',
  templateUrl: './vista-plantilla-1.component.html',
  styleUrls: ['./vista-plantilla-1.component.scss']
})
export class VistaPlantilla1Component {
  form: FormGroup;
  pageTitle: string = '';
  welcomeTitle: string = '';
  description: string = '';
  podcastInfo: string = '';
  invitationMessage: string = '';
  eventDate: string = '';
  checkboxText: string = '';
  legalText: string = '';
  imagen2: string = '';
  imagenesApi = {
    imagen1: '',
    imagen2: '',
    imagen3: '',
    imagen4: '',
    imagen5: '',
    imagen6: '',
    imagen7: '',
    imagen8: '',
    imagen9: '',
    imagen10: ''
    };
    isLoading = true;

  mostrarNombre = true;
  mostrarApellidos = true;
  mostrarCedula = true;
  mostrarCelular = true;
  mostrarEmail = true;
  mostrarPais = true;

  campos = [
    { nombre: 'nombre', mostrar: true, placeholder: 'Ingresa el nombre', title: 'Nombre', tipo: 'text' },
    { nombre: 'apellidos', mostrar: true, placeholder: 'Ingresa el apellido', title: 'Apellidos', tipo: 'text' },
    { nombre: 'cedula', mostrar: true, placeholder: 'Ingresa la cédula', title: 'Cédula', tipo: 'text' },
    { nombre: 'celular', mostrar: true, placeholder: 'Ingresa el celular', title: 'Celular', tipo: 'text' },
    { nombre: 'email', mostrar: true, placeholder: 'Ingresa el correo', title: 'Correo electrónico', tipo: 'text' },
    { nombre: 'pais', mostrar: true, placeholder: 'Ingresa el país', title: 'País', tipo: 'text' },
    { nombre: 'fechaNacimiento', mostrar: true, placeholder: 'Selecciona la fecha del evento', title: 'Fecha de nacimiento', tipo: 'date' },
    { nombre: 'genero', mostrar: true, placeholder: 'Ingresa el género', title: 'Género', tipo: 'text' },
    { nombre: 'departamento', mostrar: true, placeholder: 'Ingresa el departamento', title: 'Departamento', tipo: 'text' },
    { nombre: 'ciudad', mostrar: false, placeholder: 'Ingresa el ciudad', title: 'Ciudad', tipo: 'text' },
    { nombre: 'barrio', mostrar: false, placeholder: 'Ingresa el barrio', title: 'Barrio', tipo: 'text' },
    { nombre: 'direccion', mostrar: false, placeholder: 'Ingresa el dirección', title: 'Dirección', tipo: 'text' },

  ];

  nuevoJson: {
    pais: string; 
    cedula: any; 
    nombres: any; 
    apellidos: any; 
    telefono1: string; 
    celular1: any; 
    correo1: any; 
    fechaNacimiento: string; 
    genero: any;
    departamento: any; 
    ciudad: any; 
    barrio: any; 
    direccion: any; 
    nombreEvento: any; 
    fechaEvento: string; 
    ciudadEvento: string; 
    autorizaUsoDatosPersonales: boolean;
  };

  constructor(private fb: FormBuilder, private storageService: StorageService, private usuariosService: UsuariosService) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      celular: ['', [Validators.required, Validators.pattern('^\\+?[0-9]{4,15}$')]],  
      cedula: ['', [Validators.required, Validators.pattern('^\\+?[0-9]{4,15}$')]],  
      fechaNacimiento:['', Validators.required],
      pais: ['', Validators.required],
      genero: ['', Validators.required],
      departamento: ['', Validators.required],
      ciudad: ['', Validators.required],
      barrio: ['', Validators.required],
      direccion: ['', Validators.required],
      fechaEvento:[''],
      nombreEvento:[''],
      accept: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    const data = {
      TipoEvento: "Eventos1"
    };
  
    this.usuariosService.sharedData(data).subscribe(response => {
      if (response) {
        this.isLoading = false;
        const result = response.result;
        
        // Crear controles dinámicos basados en los campos recibidos de la API
        this.campos = result.campos || [];
  
        this.campos.forEach(campo => {
          if (campo.mostrar) {
            // Si el campo debe mostrarse, agregarlo al formulario
            if (!this.form.get(campo.nombre)) {
              this.form.addControl(campo.nombre, this.fb.control('', Validators.required));
            }
          } else {
            // Si el campo no debe mostrarse, eliminarlo del formulario
            if (this.form.get(campo.nombre)) {
              this.form.removeControl(campo.nombre);
            }
          }
        });

        console.log(this.campos)
  
        // Actualizar valores del formulario que no son dinámicos
        this.form.patchValue({
          fechaEvento: result.fechaEvento || '', 
          nombreEvento: result.nombreEvento || ''
        });
  
        // Asignar valores a los demás atributos de la clase
        this.pageTitle = result.pageTitle;
        this.welcomeTitle = result.welcomeTitle;
        this.description = result.description;
        this.podcastInfo = result.podcastInfo;
        this.invitationMessage = result.invitationMessage;
        this.eventDate = result.eventDate;
        this.checkboxText = result.checkboxText;
        this.legalText = result.legalText;
      } else {
        console.error('Error:', response.message);
      }
    });
    this.cargarImagenes();
  }

  onSubmit(): void {
    console.log('Formulario enviado', this.form.value)
    if (this.form.valid) {
      // Mapeo de valores para construir el JSON personalizado
      const formValues = this.form.value;
  
      this.nuevoJson = {
        pais: "169",  // Valor fijo
        cedula: formValues.cedula,
        nombres: formValues.nombres,
        apellidos: formValues.apellidos,
        telefono1: formValues.telefono || "No registra",  // Si existe un campo para teléfono, se usa; si no, se coloca "No registra"
        celular1: formValues.celular,
        correo1: formValues.email || "No registra",  // Correo predeterminado si no se proporciona
        fechaNacimiento: formValues.fechaNacimiento || "",  // Se asegura de que el campo esté presente o se asigna "No registra"
        genero: formValues.genero || "No especificado",  // Valor predeterminado si no se especifica género
        departamento: formValues.departamento || "No registra",  // Valor predeterminado para departamento
        ciudad: formValues.ciudad || "No registra",  // Valor predeterminado para ciudad
        barrio: formValues.barrio || "No registra",  // Valor predeterminado para barrio
        direccion: formValues.direccion || "No registra",  // Valor predeterminado para dirección
        nombreEvento: formValues.nombreEvento || "No registra",  // Nombre del evento
        fechaEvento: formValues.fechaEvento || "",  // Fecha del evento
        ciudadEvento: formValues.ciudadEvento || "",  // Campo vacío por defecto si no se proporciona valor
        autorizaUsoDatosPersonales: formValues.accept === true  // Verifica si autoriza el uso de datos personales
      };
      ;
  
      // Enviar los datos a la API
      this.usuariosService.registroNuevoUnitario(this.nuevoJson).subscribe(response => {
        if (response) {
          console.log('Formulario enviado con éxito', this.nuevoJson);
          Swal.fire({
            icon: 'success',
            title: 'Cambios guardados',
            text: 'Los cambios se han guardado correctamente.',
            confirmButtonText: 'Aceptar'
          });
        } else {
          console.error('Error al enviar el formulario:', response.message);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al guardar los cambios. Por favor, intenta nuevamente.',
            confirmButtonText: 'Aceptar'
          });
        }
      });
  
    } else {
      this.markFormFieldsTouched();
      console.log('Formulario no válido. Campos con errores:');
      this.logFormErrors();
    }
  }

 
  markFormFieldsTouched(): void {
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  logFormErrors(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control && control.invalid) {
        const errors = control.errors;
        console.log(`Campo: ${key}, Errores:`, errors);
      }
    });
  }

  isFieldInvalid(field: string): boolean {
    return (
      this.form.get(field)?.invalid && 
      (this.form.get(field)?.touched || this.form.get(field)?.dirty)
    );
  }

  cargarImagenes(): void {
    const token = "?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2030-03-26T22:37:08Z&st=2024-03-26T14:37:08Z&spr=https,http&sig=ZihEvkCGQpitgH0Ml8illawcU5oFCDuCPSc6u%2BIgY0A%3D";
    const key = {
      TipoUsuario: "Eventos1"
    };
    this.usuariosService.getBanner(key).subscribe(respuesta => {
      if (respuesta.isSuccess && respuesta.result) {
        this.imagenesApi = {
          imagen1: '',
          imagen2: '',
          imagen3: '',
          imagen4: '',
          imagen5: '',
          imagen6: '',
          imagen7: '',
          imagen8: '',
          imagen9: '',
          imagen10: ''
         
        };
  
        Object.keys(respuesta.result).forEach(key => {
          if (respuesta.result[key] && typeof respuesta.result[key] === 'string') {
            this.imagenesApi[key] = respuesta.result[key] + token;
            this.form.get(key)?.setValue(respuesta.result[key]);
          }
        });
      } else {
        this.imagenesApi = {
          imagen1: '',
          imagen2: '',
          imagen3: '',
          imagen4: '',
          imagen5: '',
          imagen6: '',
          imagen7: '',
          imagen8: '',
          imagen9: '',
          imagen10: ''
         
        };
       
        ['imagen1', 'imagen2', 'imagen3', 'imagen4', 'imagen5', 'imagen6', 'imagen7','imagen8','imagen9','imagen10'].forEach(field => {
          this.form.get(field)?.setValue('');
        });
      }
    });
  }
}