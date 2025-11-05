// resources/js/Pages/Materias/Partials/MateriaInfo.jsx
import { Head, Link } from '@inertiajs/react';

export default function MateriaInfo({ materia }) {
    return (
        <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Columna Izquierda */}
            <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Régimen Académico</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Tipo de régimen:</span>
                            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                                {materia.regimen}
                            </span>
                        </div>
                        {materia.cuatrimestre && (
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Cuatrimestre:</span>
                                <span className="text-lg font-bold text-gray-900">
                                    {materia.cuatrimestre}°
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border-2 border-blue-200">
                    <h3 className="text-sm font-semibold text-blue-700 uppercase mb-3">Carga Horaria</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-blue-600 mb-1">Horas Semanales</p>
                            <p className="text-3xl font-bold text-blue-900">
                                {materia.horas_semanales} hs
                            </p>
                        </div>
                        <div className="border-t border-blue-200 pt-4">
                            <p className="text-sm text-blue-600 mb-1">Horas Totales</p>
                            <p className="text-2xl font-bold text-blue-900">
                                {materia.horas_totales} hs
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Columna Derecha */}
            <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Información General</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-start py-2 border-b border-gray-200">
                            <span className="text-gray-600 font-medium">Código:</span>
                            <span className="text-gray-900 font-bold">{materia.codigo}</span>
                        </div>
                        <div className="flex justify-between items-start py-2 border-b border-gray-200">
                            <span className="text-gray-600 font-medium">Estado:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${materia.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {materia.estado ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Acciones</h3>
                    <div className="space-y-3">
                        <Link
                            href={route('materias.edit', materia.id)} 
                            as="button"
                            className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition flex items-center gap-2 font-semibold"
                        >
                            Editar
                        </Link>
                        <Link
                            href={route('materias.destroy', materia.id)} 
                            method="delete"
                            as="button"
                            onBefore={() => confirm('¿Estás seguro de eliminar esta comisión?')}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2 font-semibold"
                        >
                            Eliminar
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
