import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from 'src/app/shared/service/usuarios.service';
import { StorageService } from 'src/app/shared/service/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestor-pagina',
  templateUrl: './gestor-pagina.component.html',
  styleUrls: ['./gestor-pagina.component.scss']
})
export class GestorPaginaComponent {
  form: FormGroup;
  isEditable = false;
  previews: any = {};
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
  message: string;
  isLoading = true;
  selectedFile: File | null = null;
  fileData: string;


  campos = [
    { nombre: 'nombre', mostrar: true, placeholder: 'Ingresa tu nombre', title: 'Nombre', tipo: 'text' },
    { nombre: 'apellidos', mostrar: true, placeholder: 'Ingresa tu apellido', title: 'Apellidos', tipo: 'text' },
    { nombre: 'cedula', mostrar: true, placeholder: 'Ingresa tu cédula', title: 'Cédula', tipo: 'text' },
    { nombre: 'celular', mostrar: true, placeholder: 'Ingresa tu celular', title: 'Celular', tipo: 'text' },
    { nombre: 'email', mostrar: true, placeholder: 'Ingresa tu correo', title: 'Correo electrónico', tipo: 'text' },
    { nombre: 'pais', mostrar: true, placeholder: 'Ingresa tu país', title: 'País', tipo: 'text' },
    { nombre: 'fechaNacimiento', mostrar: true, placeholder: 'Selecciona la fecha del evento', title: 'Fecha de nacimiento', tipo: 'date' },
    { nombre: 'genero', mostrar: true, placeholder: 'Ingresa tu género', title: 'Género', tipo: 'text' },
    { nombre: 'departamento', mostrar: true, placeholder: 'Ingresa tu departamento', title: 'Departamento', tipo: 'text' },
    { nombre: 'ciudad', mostrar: true, placeholder: 'Ingresa tu ciudad', title: 'Ciudad', tipo: 'text' },
    { nombre: 'barrio', mostrar: true, placeholder: 'Ingresa tu barrio', title: 'Barrio', tipo: 'text' },
    { nombre: 'direccion', mostrar: true, placeholder: 'Ingresa tu dirección', title: 'Dirección', tipo: 'text' },

  ];


  constructor(private fb: FormBuilder,
    private storageService: StorageService,
     private usuariosService: UsuariosService,
     private router: Router,

    ) {}

  ngOnInit() {
    this.form = this.fb.group({
      pageTitle: ['', Validators.required],
      welcomeTitle: ['', Validators.required],
      description: ['', Validators.required],
      podcastInfo: ['', Validators.required],
      invitationMessage: ['', Validators.required],
      eventDate: ['', Validators.required],
      checkboxText: ["Acepto el tratamiento antes informado.", Validators.required],
      legalText: ['', Validators.required],
      imagen2: [''],
      TipoEvento: [''],
      nombreEvento: [''],
      fechaEvento: [''],
      nombre: [''],
      apellidos: [''],
      email: [''],
      celular: [''],  
      cedula: [''],  
      pais: [''],
      genero: [''],
      departamento: [''],
      ciudad: [''],
      barrio: [''],
      direccion: [''],
    });
  
    this.cargarContenido();
   
    this.cargarImagenes();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
  
    // Convertir el archivo a base64 para almacenarlo en localStorage
    const reader = new FileReader();
    reader.onload = () => {
      this.fileData = reader.result as string;
      localStorage.setItem('selectedFile', this.fileData);  // Almacenar el archivo en base64
    };
    reader.readAsDataURL(this.selectedFile);  // Leer el archivo como base64
  }

  onContentChange(field: string) {
    const value = this.form.get(field)?.value;
    this.usuariosService.updateData({ [field]: value });
  }

  toggleField(index: number, event: any) {
    console.log('Checkbox index:', index);
    this.campos[index].mostrar = event.target.checked;
    console.log(`Campo "${this.campos[index].nombre}" mostrar:`, this.campos[index].mostrar);
    console.log("campos entero", this.campos);
    if (this.campos[index].mostrar) {
      this.form.addControl(this.campos[index].nombre, this.fb.control('', Validators.required));
    } else {
      this.form.removeControl(this.campos[index].nombre);
    }
  }

  cargarContenido() {
    const data = {
      TipoEvento: "Eventos1"
    };
  
    this.usuariosService.sharedData(data).subscribe(response => {
      if (response.isSuccess) {
        this.isLoading = false;
        const result = response.result;
  
        // Actualizar campos según los datos recibidos de la API
        this.campos = result.campos;
  
        // Crear o actualizar controles en el formulario para los campos dinámicos
        this.campos.forEach(campo => {
          if (campo.mostrar) {
            // Si el campo debe mostrarse, agregarlo al formulario con validación requerida
            if (!this.form.get(campo.nombre)) {
              this.form.addControl(campo.nombre, this.fb.control('', Validators.required));
            }
          } else {
            // Si el campo no debe mostrarse, eliminarlo del formulario si ya existe
            if (this.form.get(campo.nombre)) {
              this.form.removeControl(campo.nombre);
            }
          }
        });
  
        // Formatear la fecha para que sea compatible con el input type="date"
        const fechaEvento = result.fechaEvento ? result.fechaEvento.split('T')[0] : '';
  
        // Actualizar otros valores del formulario
        this.form.patchValue({
          pageTitle: result.pageTitle,
          welcomeTitle: result.welcomeTitle,
          description: result.description,
          podcastInfo: result.podcastInfo,
          invitationMessage: result.invitationMessage,
          eventDate: result.eventDate,
          checkboxText: result.checkboxText,
          legalText: result.legalText,
          TipoEvento: result.tipoEvento,
          nombreEvento: result.nombreEvento,
          fechaEvento: fechaEvento // Asignamos solo la parte "YYYY-MM-DD" de la fecha
        });
      } else {
        console.error('Error:', response.message);
      }
    });
  }

  
  isFieldInvalid(field: string): boolean {
    return (
      this.form.get(field)?.invalid && 
      (this.form.get(field)?.touched || this.form.get(field)?.dirty)
    );
  }

  // selectFile(event: any, target: string): void {
  //   const file = event.target.files[0];

  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       this.previews[target] = e.target.result;
  //       this.sharedDataService.updateData({ [target]: e.target.result.split(',')[1] });
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

  saveChanges() {
    const fechaEvento = this.form.get('fechaEvento')?.value;
    if (fechaEvento) {
      const fechaFormateada = this.transformDate(fechaEvento);
      this.form.get('fechaEvento')?.setValue(fechaFormateada);
    }
  
    // Combina los valores del formulario y los campos en un solo objeto
    const dataToSend = {
      ...this.form.value, 
      selectedFile: this.fileData,  // valores del formulario
      campos: this.campos,
         // valores de los campos
    };
  
    this.isEditable = false;
    this.usuariosService.updateData(dataToSend).subscribe({
      next: (response) => {
        console.log('Cambios guardados:', dataToSend);
        console.log('Respuesta de la API:', response);
        this.cargarContenido();
  
        // Mostrar alerta de éxito
        Swal.fire({
          icon: 'success',
          title: 'Cambios guardados',
          text: 'Los cambios se han guardado correctamente.',
          confirmButtonText: 'Aceptar'
        });
      },
      error: (err) => {
        console.error('Error al guardar los cambios:', err);
  
        // Mostrar alerta de error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al guardar los cambios. Por favor, intenta nuevamente.',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  navigate() {
    this.router.navigate(['/vistas/plantilla-1']);
  }

  transformDate(fecha: string): string {
    console.log('fecha', fecha);
    const partes = fecha.split('-');
    if (partes.length === 3) {
      const anio = partes[0];
      const mes = partes[1].padStart(2, '0');
      const dia = partes[2].padStart(2, '0');
      return `${anio}-${mes}-${dia}T00:00:00`; // Añadimos la hora "00:00:00"
    }
    return "No registra";
  }

  selectFile(event: any, target: string): void {
    this.message = '';
    const file = event.target.files[0];

    if (!file) {
      console.error("No se seleccionó ningún archivo");
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      console.log(height, width);
      URL.revokeObjectURL(img.src);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previews[target] = e.target.result;
        this.form.get(target)?.setValue(e.target.result.split(',')[1]);
      };
      reader.readAsDataURL(file);
    };

    img.onerror = () => {
      console.error("No se pudo cargar la imagen");
    };
  }

  cargarImagenes() {
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
            // console.log('gorml',this.form.value)

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

  EnviarDatos(event: Event, TipoEvento: string): void {
    event.preventDefault();
    this.form.get('TipoEvento')?.setValue(TipoEvento);
  
      this.isEditable = true;
  
      const dataToSend = {
        TipoUsuario: this.form.get('TipoEvento')?.value,
        imagen2: this.form.get('imagen2')?.value
      };
  
      console.log('Datos enviados:', dataToSend);
      
      this.usuariosService.updateBanner(dataToSend).subscribe(response => {
        this.cargarImagenes(); 
      });
  }

  onSaveAndEdit(event: Event) {
    this.EnviarDatos(event, 'Eventos1'); 
    this.saveChanges(); 

  }



}
