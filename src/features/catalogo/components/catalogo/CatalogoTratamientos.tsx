import { useState } from "react";
import { Plus, Tag, FileWarning, Pencil, Trash2 } from "lucide-react";
import { useTratamientos, useFiltrosCatalogo } from "../../hooks/useTratamientos";
import TratamientoModal from "./TratamientoModal";
import Select from "../../../../components/ui/Select";
import SearchInput from "../../../../components/ui/SearchInput";
import CategoriaBadge from "../../../../components/ui/CategoriaBadge";
import type {
  Tratamiento,
  FiltrosCatalogo,
  CategoriaTratamiento,
} from "../../types/treatment";
import "../../styles/catalogo.css"
function nombreCategoria(categorias: CategoriaTratamiento[], id: string) {
  return categorias.find((c) => c.id === id)?.nombre ?? "Sin categoría";
}

function formatoPrecio(precio: number) {
  return new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
    minimumFractionDigits: 0,
  }).format(precio);
}

export default function CatalogoTratamientos() {
  const { tratamientos, categorias, cargando, error, crear, actualizar, eliminar } =
    useTratamientos();

  const [filtros, setFiltros] = useState<FiltrosCatalogo>({
    busqueda: "",
    categoriaId: "todas",
    soloActivos: true,
  });
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tratamientoEdit, setTratamientoEdit] = useState<Tratamiento | null>(null);

  const filtrados = useFiltrosCatalogo(tratamientos, filtros);

  const opcionesCategoria = [
    { value: "todas", label: "Todas las categorías" },
    ...categorias.map((c) => ({ value: c.id, label: c.nombre })),
  ];

  const abrirNuevo = () => {
    setTratamientoEdit(null);
    setModalAbierto(true);
  };

  const abrirEdicion = (t: Tratamiento) => {
    setTratamientoEdit(t);
    setModalAbierto(true);
  };

  const guardar = async (values: Parameters<typeof crear>[0]) => {
    if (tratamientoEdit) {
      await actualizar(tratamientoEdit.id, values);
    } else {
      await crear(values);
    }
  };

  const handleEliminar = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    eliminar(id);
  };

  return (
    <div className="od-page">
      <div className="od-header">
        <div>
          <h1>Catálogo de tratamientos</h1>
          <p>Procedimientos disponibles para usar en planes de tratamiento y presupuestos.</p>
        </div>
        <button className="od-btn-primary" onClick={abrirNuevo}>
          <Plus size={16} /> Nuevo tratamiento
        </button>
      </div>

      <div className="od-search-row">
        <SearchInput
          value={filtros.busqueda}
          onChange={(v) => setFiltros({ ...filtros, busqueda: v })}
          placeholder="Buscar por nombre o código..."
        />

        <Select
          options={opcionesCategoria}
          value={filtros.categoriaId}
          onChange={(v) => setFiltros({ ...filtros, categoriaId: v })}
          className="od-select-filtro"
        />
      </div>

      <div className="od-toolbar">
        <p className="od-count">
          {filtrados.length} tratamiento{filtrados.length !== 1 && "s"} encontrado
          {filtrados.length !== 1 && "s"}
        </p>
      </div>

      {cargando && <div className="od-detalle-estado">Cargando catálogo...</div>}

      {error && !cargando && (
        <div className="od-empty">
          <FileWarning size={40} />
          <p>{error}</p>
        </div>
      )}

      {!cargando && !error && filtrados.length === 0 && (
        <div className="od-empty">
          <Tag size={40} />
          <p>No hay tratamientos que coincidan con tu búsqueda.</p>
          <button className="od-btn-secondary" onClick={abrirNuevo}>
            <Plus size={15} /> Crear el primero
          </button>
        </div>
      )}

      {!cargando && !error && filtrados.length > 0 && (
        <div className="od-tabla-wrap od-tabla-tratamientos">
          <table className="od-tabla">
            <thead>
              <tr>
                <th>Código</th>
                <th>Tratamiento</th>
                <th>Categoría</th>
                <th className="od-th-right">Precio base</th>
                <th className="od-th-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((t) => (
                <tr key={t.id}>
                  <td>{t.codigo}</td>
                  <td className="od-tabla-nombre">
                    {t.nombre}
                    {!t.activo && <span className="od-badge od-badge-inactivo"> Inactivo</span>}
                  </td>
                  <td>
                    <CategoriaBadge id={t.categoriaId} nombre={nombreCategoria(categorias, t.categoriaId)} />
                  </td>
                  <td className="od-td-right od-tabla-precio">{formatoPrecio(t.precioBase)}</td>
                  <td className="od-td-right">
                    <div className="od-tabla-acciones">
                      <button className="od-tabla-icono-btn" onClick={() => abrirEdicion(t)}>
                        <Pencil size={16} />
                      </button>
                      <button
                        className="od-tabla-icono-btn eliminar"
                        onClick={(e) => handleEliminar(e, t.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <TratamientoModal
        abierto={modalAbierto}
        tratamiento={tratamientoEdit}
        categorias={categorias}
        onClose={() => setModalAbierto(false)}
        onGuardar={guardar}
      />
    </div>
  );
}