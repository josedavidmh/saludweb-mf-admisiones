export type AdmisionRegistradaDetalle = {
  id: string;
  paciente: string;
  documento: string;
  eapb: string;
  fechaAdmision: string;
};

export function emitirAdmisionRegistrada(detalle: AdmisionRegistradaDetalle) {
  window.dispatchEvent(new CustomEvent("saludweb:admision-registrada", { detail: detalle }));
}
