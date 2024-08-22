import { Injectable } from '@angular/core';
import { CoreService } from '../core.service';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../interfaces/usuarios';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService extends CoreService  {

  constructor(
    protected override http: HttpClient
) { 
    super(http);
}

getData() {
    return this.get<Usuario[]>('/Usuario/GetUsuarios');
}

getUser(id: string){
    console.log('peticion', id);
    return this.get(`/Usuario/GetUsuario/${id}`);

    //return this.post<Producto[]>('/get-product', id);
}

usuarioNuevo(user: any[]){
    return this.post<Response>('/Usuario/Usuarios', user);
}

registroNuevo(data: any[]){
    return this.http.post<any>('https://srvextranet.leonisa.com/Aplicativos_Informaticos/CustomerCentric/api/ClientEvent/AddArrangeEvent', data);
}

excelData(jsonData: any[]) {
    return this.post<Usuario[]>('/Usuario/LoadUsuarios', jsonData );
}

deteleUser(id: any){
    return this.delete<any>(`/Usuario/DeleteUsuario/${id}`);
}

guardarPuntos(jsonData: any[]) {
    return this.post<any>('/fidelizacion/LoadPuntosManuales', jsonData );
}

extractos(datos: any) {
    return this.post("/LoadExtractos", datos);
}

getPuntos() {
    return this.get<Usuario[]>('/fidelizacion/GetPuntosManuales');
}

detelePunto(id: any){
    return this.delete<any>(`/fidelizacion/DeletePuntoManual/${id}`);
}

detelePuntos(ids: any){
    return this.post<any>(`/fidelizacion/DeletePuntoManuales`, ids);
}

getMovimientos(cedula: any) {
    return this.get<any[]>(`/GetExtractosByUsuario/${cedula}`);
  }

}
