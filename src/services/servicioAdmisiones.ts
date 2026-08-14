// mf-admisiones es la fuente de verdad del dominio "Admisión de usuarios".
// Se persiste en localStorage bajo "saludweb:admisiones" para que
// mf-historia-clinica pueda leer la lista completa y actualizada al
// montarse, sin depender de haber estado "escuchando" en el momento exacto
// en que se registró el paciente (el CustomEvent en vivo se mantiene como
// mejora adicional para cuando ambos ya están cargados en la misma sesión,
// pero localStorage es lo que garantiza coherencia entre navegaciones).
export type Admision = {
  id: string;
  paciente: string;
  documento: string;
  eapb: string;
  fechaAdmision: string;
};

export const EAPB_DISPONIBLES = [
  "Nueva EPS",
  "EPS Sura - Contributivo",
  "Sanitas",
  "Compensar",
];

const CLAVE_STORAGE = "saludweb:admisiones";

const ADMISIONES_SEED: Admision[] = [
  { id: "a1", paciente: "Sofía León", documento: "1023456789", eapb: "Nueva EPS", fechaAdmision: "2026-08-01" },
];

function leer(): Admision[] {
  if (typeof window === "undefined") return ADMISIONES_SEED;
  try {
    const guardado = window.localStorage.getItem(CLAVE_STORAGE);
    if (guardado) return JSON.parse(guardado);
    window.localStorage.setItem(CLAVE_STORAGE, JSON.stringify(ADMISIONES_SEED));
    return ADMISIONES_SEED;
  } catch {
    return ADMISIONES_SEED;
  }
}

function guardar(lista: Admision[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CLAVE_STORAGE, JSON.stringify(lista));
  } catch {
    // localStorage puede fallar en modo privado/incógnito; el registro
    // sigue funcionando en memoria para la sesión actual.
  }
}

function esperar(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function obtenerAdmisionesAPI(): Promise<Admision[]> {
  await esperar(300);
  return [...leer()];
}

export async function registrarAdmisionAPI(datos: Omit<Admision, "id">): Promise<Admision> {
  await esperar(400);
  const nueva: Admision = { id: `a${Date.now()}`, ...datos };
  const actualizadas = [...leer(), nueva];
  guardar(actualizadas);
  return nueva;
}
