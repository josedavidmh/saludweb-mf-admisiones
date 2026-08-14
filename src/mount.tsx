import { createRoot, type Root } from "react-dom/client";
import { AdmisionesView } from "./components/AdmisionesView";

const raices = new WeakMap<HTMLElement, Root>();

export function mount(contenedor: HTMLElement, _props: Record<string, unknown> = {}) {
  const raiz = createRoot(contenedor);
  raices.set(contenedor, raiz);
  raiz.render(<AdmisionesView />);
}

export function unmount(contenedor: HTMLElement) {
  const raiz = raices.get(contenedor);
  if (raiz) {
    raiz.unmount();
    raices.delete(contenedor);
  }
}

declare global {
  interface Window {
    SaludWebMFAdmisiones: { mount: typeof mount; unmount: typeof unmount };
  }
}

if (typeof window !== "undefined") {
  window.SaludWebMFAdmisiones = { mount, unmount };
}
