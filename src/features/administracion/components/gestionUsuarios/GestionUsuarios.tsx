import { useMemo, useState } from "react";
import {
  Plus,
  Users,
  Activity,
  ShieldCheck,
  UserX,
  FileWarning,
  Search,
  Download,
  MoreVertical,
  Pencil,
  KeyRound,
  Ban,
  CheckCircle2,
} from "lucide-react";
import { useUsuarios, useFiltrosUsuarios } from "../../hooks/useUsuarios";
import UsuarioModal from "./UsuarioModal";
import CredencialesModal from "./CredencialesModal";
import Select from "../../../../components/ui/Select";
import type { Usuario, FiltrosUsuarios as FiltrosUsuariosType } from "../../types/user";
import "../../styles/gestionUsuarios.css";
import "../../../catalogo/styles/catalogo.css";

const ROL_LABEL: Record<string, string> = { admin: "Administrador", doctor: "Doctor" };

function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "??";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

function formatoFecha(fechaISO: string): string {
  return new Intl.DateTimeFormat("es-BO", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(fechaISO)
  );
}

export default function GestionUsuarios() {
  const { usuarios, cargando, error, crear, actualizar, cambiarEstado, regenerarPassword } = useUsuarios();

  const [filtros, setFiltros] = useState<FiltrosUsuariosType>({ busqueda: "", rol: "todos", estado: "todos" });
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState<Usuario | null>(null);
  const [credenciales, setCredenciales] = useState<{ usuario: Usuario; password: string } | null>(null);
  const [menuAbiertoId, setMenuAbiertoId] = useState<number | null>(null);

  const filtrados = useFiltrosUsuarios(usuarios, filtros);

  const stats = useMemo(() => {
    const total = usuarios.length;
    const doctoresActivos = usuarios.filter((u) => u.rol === "doctor" && u.activo).length;
    const administradores = usuarios.filter((u) => u.rol === "admin").length;
    const suspendidos = usuarios.filter((u) => !u.activo).length;
    return { total, doctoresActivos, administradores, suspendidos };
  }, [usuarios]);

  const opcionesRol = [
    { value: "todos", label: "Todos los roles" },
    { value: "admin", label: "Administrador" },
    { value: "doctor", label: "Doctor" },
  ];

  const opcionesEstado = [
    { value: "todos", label: "Todos los estados" },
    { value: "activo", label: "Activos" },
    { value: "inactivo", label: "Inactivos" },
  ];

  const abrirNuevo = () => { setUsuarioEdit(null); setModalAbierto(true); };
  const abrirEdicion = (u: Usuario) => { setUsuarioEdit(u); setMenuAbiertoId(null); setModalAbierto(true); };

  const guardar = async (values: Parameters<typeof crear>[0]) => {
    if (usuarioEdit) {
      await actualizar(usuarioEdit.id, values);
    } else {
      const { usuario, passwordTemporal } = await crear(values);
      setCredenciales({ usuario, password: passwordTemporal });
    }
  };

  const toggleEstado = async (u: Usuario) => { setMenuAbiertoId(null); await cambiarEstado(u.id, !u.activo); };
  const handleRegenerar = async (u: Usuario) => {
    setMenuAbiertoId(null);
    const password = await regenerarPassword(u.id);
    setCredenciales({ usuario: u, password });
  };

  const exportarCsv = () => {
    const encabezados = ["Nombre", "Email", "Rol", "Especialidad", "Fecha creación", "Estado"];
    const filas = filtrados.map((u) => [
      u.nombreCompleto,
      u.email,
      ROL_LABEL[u.rol],
      u.especialidad ?? "-",
      formatoFecha(u.creadoEn),
      u.activo ? "Activo" : "Inactivo",
    ]);
    const csv = [encabezados, ...filas].map((fila) => fila.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "usuarios.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="od-page">
      <div className="od-header">
        <div>
          <h1>Administración de Usuarios</h1>
          <p>Administra las cuentas de doctores y administradores del sistema.</p>
        </div>
        <button className="od-btn-primary" onClick={abrirNuevo}>
          <Plus size={16} /> Crear Usuario
        </button>
      </div>

      <div className="od-stats-grid">
        <div className="od-stat-card">
          <div className="od-stat-header">
            <span>Total de usuarios</span>
            <Users size={18} className="od-stat-icon" />
          </div>
          <div className="od-stat-value">{stats.total}</div>
        </div>
        <div className="od-stat-card">
          <div className="od-stat-header">
            <span>Doctores activos</span>
            <Activity size={18} className="od-stat-icon od-stat-icon-verde" />
          </div>
          <div className="od-stat-value">{stats.doctoresActivos}</div>
        </div>
        <div className="od-stat-card">
          <div className="od-stat-header">
            <span>Administradores</span>
            <ShieldCheck size={18} className="od-stat-icon od-stat-icon-azul" />
          </div>
          <div className="od-stat-value">{stats.administradores}</div>
        </div>
        <div className="od-stat-card">
          <div className="od-stat-header">
            <span>Usuarios suspendidos</span>
            <UserX size={18} className="od-stat-icon od-stat-icon-rojo" />
          </div>
          <div className="od-stat-value">{stats.suspendidos}</div>
        </div>
      </div>

      <div className="od-filtros-card">
        <div className="od-buscador-usuarios">
          <Search size={15} className="od-buscador-icono" />
          <input
            value={filtros.busqueda}
            onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
            placeholder="Buscar usuario..."
          />
        </div>
        <Select options={opcionesRol} value={filtros.rol} onChange={(v) => setFiltros({ ...filtros, rol: v as FiltrosUsuariosType["rol"] })} className="od-select-filtro" />
        <Select options={opcionesEstado} value={filtros.estado} onChange={(v) => setFiltros({ ...filtros, estado: v as FiltrosUsuariosType["estado"] })} className="od-select-filtro" />
        <button className="od-btn-secondary" onClick={exportarCsv}>
          <Download size={15} /> Exportar
        </button>
      </div>

      {cargando && <div className="od-detalle-estado">Cargando usuarios...</div>}
      {error && !cargando && <div className="od-empty"><FileWarning size={40} /><p>{error}</p></div>}

      {!cargando && !error && filtrados.length === 0 && (
        <div className="od-empty">
          <Users size={40} />
          <p>No hay usuarios que coincidan con tu búsqueda.</p>
          <button className="od-btn-secondary" onClick={abrirNuevo}><Plus size={15} /> Crear el primero</button>
        </div>
      )}

      {!cargando && !error && filtrados.length > 0 && (
        <div className="od-tabla-wrap od-tabla-tratamientos">
          <table className="od-tabla">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Especialidad</th>
                <th>Fecha creación</th>
                <th>Estado</th>
                <th>Ultimo acceso</th>
                <th className="od-th-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="od-usuario-cell">
                      <span className="od-avatar-usuario">{iniciales(u.nombreCompleto)}</span>
                      <span className="od-tabla-nombre">{u.nombreCompleto}</span>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td><span className={`od-badge od-badge-rol-${u.rol}`}>{ROL_LABEL[u.rol]}</span></td>
                  <td>{u.especialidad || "-"}</td>
                  <td>{formatoFecha(u.creadoEn)}</td>
                  <td><span className={`od-badge ${u.activo ? "od-badge-activo" : "od-badge-inactivo"}`}>{u.activo ? "Activo" : "Inactivo"}</span></td>
                  <td>{u.ultimoAcceso ? formatoFecha(u.ultimoAcceso) : "-"}</td>
                  <td className="od-td-right">
                    <div className="od-acciones-menu-wrap">
                      <button
                        className="od-tabla-icono-btn"
                        onClick={() => setMenuAbiertoId(menuAbiertoId === u.id ? null : u.id)}
                      >
                        <MoreVertical size={16} />
                      </button>
                      {menuAbiertoId === u.id && (
                        <>
                          <div className="od-acciones-overlay" onClick={() => setMenuAbiertoId(null)} />
                          <div className="od-acciones-dropdown">
                            <button onClick={() => abrirEdicion(u)}><Pencil size={14} /> Editar</button>
                            <button onClick={() => handleRegenerar(u)}><KeyRound size={14} /> Regenerar contraseña</button>
                            <button onClick={() => toggleEstado(u)} className={u.activo ? "od-accion-peligro" : ""}>
                              {u.activo ? <Ban size={14} /> : <CheckCircle2 size={14} />}
                              {u.activo ? "Desactivar" : "Activar"}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <UsuarioModal abierto={modalAbierto} usuario={usuarioEdit} onClose={() => setModalAbierto(false)} onGuardar={guardar} />
      <CredencialesModal credenciales={credenciales} onClose={() => setCredenciales(null)} />
    </div>
  );
}