import React from 'react';

export default function CarreraInfo({ carrera }) {
    return (
        <div className="grid md:grid-cols-2 gap-8">

            {/* Columna Izquierda: Información Principal */}
            <div className="space-y-6">

                {/* Información Principal */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                        Información Principal
                    </h3>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Sede:</span>
                            <span className="font-semibold text-gray-900">{carrera.sede || 'No especificada'}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Modalidad:</span>
                            <span className="font-semibold text-gray-900">{carrera.modalidad || 'No especificada'}</span>
                        </div>

                    </div>
                </div>

                {/* Instituto */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                        Instituto
                    </h3>

                    <div className="space-y-3">
                        {carrera.instituto && (
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-900">{carrera.instituto.nombre}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Columna Derecha: Datos adicionales */}
            <div className="space-y-6">

                {/* Estado */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                        Estado 
                    </h3>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span
                                className={`font-semibold ${
                                    carrera.estado ? 'text-green-700' : 'text-red-700'
                                }`}
                            >
                                {carrera.estado ? 'Activa' : 'Inactiva'}
                            </span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
