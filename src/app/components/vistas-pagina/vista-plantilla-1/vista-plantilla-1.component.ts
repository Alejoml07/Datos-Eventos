import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-vista-plantilla-1',
  templateUrl: './vista-plantilla-1.component.html',
  styleUrls: ['./vista-plantilla-1.component.scss']
})
export class VistaPlantilla1Component {
  pageTitle: string = '';
  welcomeTitle: string = '';
  description: string = '';
  podcastInfo: string = '';
  invitationMessage: string = '';
  eventDate: string = '';
  checkboxText: string = '';
  legalText: string = '';

  ngOnInit() {
    // Cargar los valores guardados desde localStorage al iniciar el componente
    this.pageTitle = localStorage.getItem('pageTitle') || '';
    this.welcomeTitle = localStorage.getItem('welcomeTitle') || '';
    this.description = localStorage.getItem('description') || '';
    this.podcastInfo = localStorage.getItem('podcastInfo') || '';
    this.invitationMessage = localStorage.getItem('invitationMessage') || '';
    this.eventDate = localStorage.getItem('eventDate') || '';
    this.checkboxText = localStorage.getItem('checkboxText') || '';
    this.legalText = localStorage.getItem('legalText') || '';
  }

}
