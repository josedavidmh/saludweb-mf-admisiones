import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import { useStore } from "../useStore";
import { admisionesStore } from "../stores/admisionesStore";
import { cargarAdmisiones, registrarAdmision } from "../actions/admisionesActions";
import { EAPB_DISPONIBLES } from "../services/servicioAdmisiones";

export function AdmisionesView() {
  const admisiones = useStore(
    (l) => admisionesStore.subscribe(l),
    () => admisionesStore.getAdmisiones()
  );

  const [paciente, setPaciente] = useState("");
  const [documento, setDocumento] = useState("");
  const [eapb, setEapb] = useState(EAPB_DISPONIBLES[0]);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    cargarAdmisiones();
  }, []);

  async function manejarCrear(e: FormEvent) {
    e.preventDefault();
    if (!paciente || !documento || !eapb) return;
    setEnviando(true);
    try {
      await registrarAdmision({
        paciente,
        documento,
        eapb,
        fechaAdmision: new Date().toISOString().slice(0, 10),
      });
      setPaciente("");
      setDocumento("");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div>
      <div style={encabezadoEstilo}>
        <h1 style={{ margin: 0 }}>Gestión administrativa — Admisión de usuarios</h1>
        <span style={etiquetaMfEstilo}>microfrontend: mf-admisiones</span>
      </div>

      <form onSubmit={manejarCrear} style={formEstilo}>
        <input placeholder="Nombre del paciente" value={paciente} onChange={(e) => setPaciente(e.target.value)} style={campoEstilo} />
        <input placeholder="Documento" value={documento} onChange={(e) => setDocumento(e.target.value)} style={campoEstilo} />
        <select value={eapb} onChange={(e) => setEapb(e.target.value)} style={campoEstilo}>
          {EAPB_DISPONIBLES.map((op) => (
            <option key={op} value={op}>
              {op}
            </option>
          ))}
        </select>
        <button type="submit" disabled={enviando}>
          {enviando ? "Registrando..." : "Registrar admisión"}
        </button>
      </form>

      <p style={ayudaEstilo}>
        Al registrar una admisión se emite el evento <code>saludweb:admision-registrada</code>,
        que mf-historia-clinica escucha para ofrecer el paciente en su modal "Buscar paciente",
        sin acoplarse a este microfrontend.
      </p>

      <div style={contenedorTablaEstilo}>
        <table style={tablaEstilo}>
          <thead>
            <tr>
              <th style={celdaEstilo}>Paciente</th>
              <th style={celdaEstilo}>Documento</th>
              <th style={celdaEstilo}>EAPB</th>
              <th style={celdaEstilo}>Fecha de admisión</th>
            </tr>
          </thead>
          <tbody>
            {admisiones.map((a) => (
              <tr key={a.id}>
                <td style={celdaEstilo}>{a.paciente}</td>
                <td style={celdaEstilo}>{a.documento}</td>
                <td style={celdaEstilo}>{a.eapb}</td>
                <td style={celdaEstilo}>{a.fechaAdmision}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const encabezadoEstilo: CSSProperties = { display: "flex", alignItems: "center", gap: 10, marginBottom: 16 };
const etiquetaMfEstilo: CSSProperties = {
  fontSize: 11,
  color: "#7C3AED",
  background: "#EDE9FE",
  border: "1px solid #C4B5FD",
  borderRadius: 999,
  padding: "2px 10px",
  fontFamily: "monospace",
};
const formEstilo: CSSProperties = { display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap", alignItems: "center" };
const campoEstilo: CSSProperties = { padding: 8, border: "1px solid #D1D5DB", borderRadius: 6 };
const ayudaEstilo: CSSProperties = { fontSize: 12, color: "#6B7280", marginBottom: 16 };
const contenedorTablaEstilo: CSSProperties = { maxHeight: 420, overflowY: "auto", border: "1px solid #E5E7EB", borderRadius: 6 };
const tablaEstilo: CSSProperties = { width: "100%", borderCollapse: "collapse", background: "white" };
const celdaEstilo: CSSProperties = { border: "1px solid #E5E7EB", padding: 8, textAlign: "left" };
