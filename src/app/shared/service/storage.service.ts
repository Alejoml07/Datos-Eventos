import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    // private data = new BehaviorSubject<any>({
    //     pageTitle: 'Inscripción PlaSerez',
    //     welcomeTitle: 'BIENVENIDA A PLASEREZ',
    //     description: 'Acompáñanos en el lanzamiento virtual de nuestra nueva colección PLA SEREZ Leonsia by Serez.',
    //     podcastInfo: '¿Lo mejor? Tendremos muchas sorpresas y un episodio especial en vivo del podcast Confesiones con Serez, junto a Maleja Restrepo.',
    //     invitationMessage: 'Recibirás un correo con la invitación para conectarte',
    //     eventDate: 'Agosto 22 | 8:00 pm',
    //     checkboxText: 'Acepto el tratamiento antes informado.',
    //     legalText: 'GL C.I. LEONISA S.A.S ...',
    //     imagen2: ''
    //   });
    
    //   sharedData = this.data.asObservable();
    
     




    private storage: Storage;

    constructor() {
        this.storage = localStorage; // Puedes cambiarlo a sessionStorage si lo prefieres
    }

    setItem(key: string, value: any): void {
        this.storage.setItem(key, JSON.stringify(value));
    }

    getItem(key: string): any {
        const value = this.storage.getItem(key);
        return value ? JSON.parse(value) : null;
    }

    removeItem(key: string): void {
        this.storage.removeItem(key);
    }

    clear(): void {
        this.storage.clear();
    }
}