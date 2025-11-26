// resources/js/Pages/Materias/Partials/MateriaComisiones.jsx
import { Link } from '@inertiajs/react';
import React, { useState, useMemo} from 'react';
import TableFilters from '@/Components/TableFilters';
export default function ComisionDocentes({ comision, docentes, allDocentes, filters: initialFilters = {}  }) {
    const [filters, setFilters] = useState({
        search: initialFilters.search || '',

    });
    const [search, setSearch] = useState("");

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };


    const filterConfig = [
        {
            key: 'search', label: 'Buscar', type: 'text', value: filters.search, placeholder: 'Buscar por nombre, apellido o legajo...'
        }
    ];

    const docentesFiltrados = useMemo(() => {
        const query = filters.search.toLowerCase().trim();
        if (!query) return [];

        return allDocentes.filter((d) => {
            const nombre = d.nombre?.toLowerCase() || '';
            const apellido = d.apellido?.toLowerCase() || '';
            const legajo = d.legajo?.toString() || '';
            return (
                nombre.includes(query) ||
                apellido.includes(query) ||
                legajo.includes(query)
            );
        });
    }, [filters.search, allDocentes]);


    return (
        <div>
            <h3 className="text-2xl font-bold mb-6">Docentes en la comision</h3>
            {docentes.length > 0 ? (
            <ul className="divide-y divide-gray-200">
                {docentes.map((docente) => (
                    <li key={docente.id} className="py-4 flex justify-between items-center">
                        {/* Nombre de la comisión */}
                        <span className="text-gray-800 font-medium">
                            {docente.nombre}
                        </span>

                        {/* Contenedor de acciones */}
                        <div className="flex items-center space-x-4">

                            <Link
                                href={route('dictas.edit', docente.dicta_id)}
                                className="text-blue-600 hover:underline"
                            >
                                Editar relacion
                            </Link>


                            <Link
                                href={route('docentes.show', docente.id)}
                                className="text-blue-600 hover:underline"
                            >
                                Ver Detalles
                            </Link>

                            <Link
                                href={route('dictas.destroy', docente.dicta_id)}
                                method="delete"
                                as="button"
                                onBefore={() => confirm('¿Estás seguro de eliminar al docente de esta comision?')}
                                className="bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700 transition"
                            >
                                Eliminar
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
            ) : (
                <p className="text-gray-600">No hay docentes en esta comision</p>
            )}
            <div>
            <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2">Buscar docente</h4>
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <TableFilters
                            filters={filterConfig}
                            onChange={handleFilterChange}
                        />
                    </div>

                {docentesFiltrados.length > 0 && (
                    <ul className="border border-gray-200 rounded-md shadow-sm bg-white max-h-60 overflow-y-auto">
                        {docentesFiltrados.map((docente) => (
                            <li
                                key={docente.id}
                                className="p-2 hover:bg-blue-50 cursor-pointer flex justify-between items-center"
                                onClick={() =>
                                    (window.location.href = route("dictas.create", {
                                        comision_id: comision.id,
                                        docente_id: docente.id,
                                    }))
                                }
                            >
                                <span>
                                    {docente.nombre} {docente.apellido}
                                </span>
                                <span className="text-sm text-gray-500">
                                    Legajo: {docente.legajo || "—"}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            </div>
        </div>
    );
}
