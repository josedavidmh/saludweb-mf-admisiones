import { dispatcher, Accion } from "../dispatcher";
import { Admision } from "../services/servicioAdmisiones";

type Listener = () => void;

class AdmisionesStore {
  private admisiones: Admision[] = [];
  private listeners: Listener[] = [];

  getAdmisiones(): Admision[] {
    return this.admisiones;
  }

  subscribe(l: Listener) {
    this.listeners.push(l);
    return () => {
      this.listeners = this.listeners.filter((x) => x !== l);
    };
  }

  private notificar() {
    this.listeners.forEach((l) => l());
  }

  handleAction(accion: Accion) {
    switch (accion.type) {
      case "ADMISIONES_CARGADAS":
        this.admisiones = accion.payload;
        this.notificar();
        break;
      case "ADMISIONES_REGISTRADA":
        this.admisiones = [...this.admisiones, accion.payload];
        this.notificar();
        break;
    }
  }
}

export const admisionesStore = new AdmisionesStore();
dispatcher.register((accion) => admisionesStore.handleAction(accion));
