import { Injectable } from '@angular/core';
import { CoreService } from '../core.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from '../interfaces/usuarios';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService extends CoreService  {

  constructor(
    protected override http: HttpClient
) { 
    super(http);
}

private apiUrl = 'https://srvappswebleo.leonisa.com/Aplicativos_Informaticos/mailservice/api/v1/Mail/send';

sendMail(mailData: any, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('mailData', JSON.stringify(mailData));
    formData.append('formFiles', file);

    const headers = new HttpHeaders({
      'Accept': 'application/json',
    });

    return this.http.post(this.apiUrl, formData, { headers });
  }

registroNuevo(data: any[]){
    return this.http.post<any>('https://srvextranet.leonisa.com/Aplicativos_Informaticos/CustomerCentric/api/ClientEvent/AddArrangeEvent', data);
}
registroNuevoUnitario(data: any){
    return this.http.post<any>('https://srvextranet.leonisa.com/Aplicativos_Informaticos/CustomerCentric/api/ClientEvent/AddEvent', data);
}

getBanner(tipoUsuario: any){
    return this.post<any>('/Productos/GetBannerByEvent', tipoUsuario);
}

updateBanner(jsonData: any){
    return this.post<any>('/Productos/AddBannerEventos', jsonData);
}

updateData(jsonData: any) {
    return this.post<any>('/fidelizacion/AddEventoContenido', jsonData);  
}

sharedData(jsonData: any) {
    return this.post<any>('/fidelizacion/GetEventoContenidoByEvento', jsonData);  
}




}
