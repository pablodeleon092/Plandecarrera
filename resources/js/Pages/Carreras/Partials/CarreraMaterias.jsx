import React from "react";
import DataTable from "@/Components/DataTable";

export default function CarreraMaterias({ carrera, materias }) {
    
    const columns = [
        { key: "nombre", label: "Nombre" },
        { key: "codigo", label: "Código" },
        { key: "regimen", label: "Régimen" },
        { key: "cuatrimestre", label: "Cuatrimestre / Año" },
        { key: "horas_semanales", label: "Horas Semanales" },
        { key: "horas_totales", label: "Horas Totales" },
        {
            key: "acciones",
            label: "Acciones",
            render: (m) => (
                <div className="flex items-center space-x-3">
                    <a 
                        href={route("materias.show", m.id)}
                        className="text-blue-600 hover:underline"
                    >
                        Ver
                    </a>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-10">
            <h3 className="text-2xl font-bold mb-6">
                Materias del Plan Actual — {carrera.nombre}
            </h3>

            <DataTable
                columns={columns}
                data={materias}
                emptyMessage="Esta carrera no tiene un plan o no tiene materias asignadas."
            />
        </div>
    );
}
