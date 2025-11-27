// resources/js/Pages/Materias/Partials/MateriaInfo.jsx
import { Head, Link } from '@inertiajs/react';
export default function ComisionInfo({ comision }) {
    return (
        <div className="space-y-8">

            {/* GRID PRINCIPAL */}
            <div className="grid md:grid-cols-2 gap-8">

                {/* Columna Izquierda */}
                <div className="space-y-6">

                    {/* Materia */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Materia</h3>

                        <p className="text-lg font-bold">
                            {comision?.materia?.nombre} ({comision?.materia?.codigo})
                        </p>

                        <p className="text-gray-600 mt-1">
                            Horas semanales: {comision?.materia?.horas_semanales}
                        </p>
                    </div>

                    {/* Carga Horaria */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border-2 border-blue-200">
                        <h3 className="text-sm font-semibold text-blue-700 uppercase mb-3">
                            Carga Horaria Comisión
                        </h3>

                        <div className="space-y-2">
                            <p>Horas Teóricas: {comision.horas_teoricas}</p>
                            <p>Horas Prácticas: {comision.horas_practicas}</p>
                            <p>Horas Totales: {comision.horas_totales}</p>
                        </div>
                    </div>

                </div>

                {/* Columna Derecha */}
                <div className="space-y-6">

                    {/* Información General */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                            Información General
                        </h3>

                        <div className="space-y-2">
                            <p><strong>Turno:</strong> {comision.turno}</p>
                            <p><strong>Modalidad:</strong> {comision.modalidad}</p>
                            <p><strong>Cuatrimestre:</strong> {comision.cuatrimestre}</p>
                            <p><strong>Año:</strong> {comision.anio}</p>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}
