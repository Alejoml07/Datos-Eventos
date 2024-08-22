import { Component } from '@angular/core';

@Component({
  selector: 'app-gestor-pagina',
  templateUrl: './gestor-pagina.component.html',
  styleUrls: ['./gestor-pagina.component.scss']
})
export class GestorPaginaComponent {
  isEditable = false;
  showVistaPlantilla = false;

  // Variables iniciales
  pageTitle: string;
  welcomeTitle: string;
  description: string;
  podcastInfo: string;
  invitationMessage: string;
  eventDate: string;
  checkboxText: string;
  legalText: string;

  ngOnInit() {
    // Cargar los valores guardados desde localStorage al iniciar el componente
    this.pageTitle = localStorage.getItem('pageTitle') || 'Inscripción PlaSerez';
    this.welcomeTitle = localStorage.getItem('welcomeTitle') || 'BIENVENIDA A PLASEREZ';
    this.description = localStorage.getItem('description') || 'Acompáñanos en el lanzamiento virtual de nuestra nueva colección PLA SEREZ Leonsia by Serez.';
    this.podcastInfo = localStorage.getItem('podcastInfo') || '¿Lo mejor? Tendremos muchas sorpresas y un episodio especial en vivo del podcast Confesiones con Serez, junto a Maleja Restrepo.';
    this.invitationMessage = localStorage.getItem('invitationMessage') || 'Recibirás un correo con la invitación para conectarte';
    this.eventDate = localStorage.getItem('eventDate') || 'Agosto 22 | 8:00 pm';
    this.checkboxText = localStorage.getItem('checkboxText') || 'Acepto el tratamiento antes informado.';
    this.legalText = localStorage.getItem('legalText') || 'GL C.I. LEONISA S.A.S ...';
  }

  enableEditing() {
    this.isEditable = true;
  }

  onContentChange(event: any, field: string) {
    this[field] = event.target.value; // Cambiar de innerText a value
  }

  saveChanges() {
    // Guardar los cambios en localStorage
    localStorage.setItem('pageTitle', this.pageTitle);
    localStorage.setItem('welcomeTitle', this.welcomeTitle);
    localStorage.setItem('description', this.description);
    localStorage.setItem('podcastInfo', this.podcastInfo);
    localStorage.setItem('invitationMessage', this.invitationMessage);
    localStorage.setItem('eventDate', this.eventDate);
    localStorage.setItem('checkboxText', this.checkboxText);
    localStorage.setItem('legalText', this.legalText);
    
    // Desactivar la edición después de guardar
    this.isEditable = false;

    // Mostrar el nuevo componente con la información estática
    this.showVistaPlantilla = true;

    console.log('Cambios guardados:', {
      pageTitle: this.pageTitle,
      welcomeTitle: this.welcomeTitle,
      description: this.description,
      podcastInfo: this.podcastInfo,
      invitationMessage: this.invitationMessage,
      eventDate: this.eventDate,
      checkboxText: this.checkboxText,
      legalText: this.legalText
    });
  }
}
