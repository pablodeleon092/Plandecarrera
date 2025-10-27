import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function ShowComision({ auth, comision, docentes }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Comisión: {comision.nombre}</h2>}
        >
            <Head title={`Comisión: ${comision.nombre}`} />

            <div className="bg-gray-50 py-8">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="mb-6">
                        <Link 
                            href={route('comisiones.index')} 
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-2 transition"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Volver a Comisiones
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-3xl font-bold text-white">{comision.nombre}</h1>
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                            comision.estado ? 'bg-green-400 text-green-900' : 'bg-red-400 text-red-900'
                                        }`}>
                                            {comision.estado ? 'Activa' : 'Inactiva'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-blue-100">
                                        <span className="flex items-center gap-2">
                                            Código: {comision.codigo}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            Año: {comision.anio}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Link
                                        href={route('comisiones.edit', comision.id)} 
                                        className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition flex items-center gap-2 font-semibold"
                                    >
                                        Editar
                                    </Link>
                                    <Link
                                        href={route('comisiones.destroy', comision.id)} 
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

                        <div className="p-8">
                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                                {/* Columna Izquierda: Materia y Carga Horaria */}
                                <div className="space-y-6">
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Materia</h3>
                                        <p className="text-lg font-bold">{comision?.materia.nombre} ({comision?.materia.codigo})</p>
                                        <p className="text-gray-600 mt-1">Horas semanales: {comision?.materia.horas_semanales}</p>
                                    </div>

                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border-2 border-blue-200">
                                        <h3 className="text-sm font-semibold text-blue-700 uppercase mb-3">Carga Horaria Comisión</h3>
                                        <div className="space-y-2">
                                            <p>Horas Teóricas: {comision.horas_teoricas}</p>
                                            <p>Horas Prácticas: {comision.horas_practicas}</p>
                                            <p>Horas Totales: {comision.horas_totales}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Columna Derecha: Información general y docentes */}
                                <div className="space-y-6">
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Información General</h3>
                                        <div className="space-y-2">
                                            <p><strong>Turno:</strong> {comision.turno}</p>
                                            <p><strong>Modalidad:</strong> {comision.modalidad}</p>
                                            <p><strong>Cuatrimestre:</strong> {comision.cuatrimestre}</p>
                                            <p><strong>Año:</strong> {comision.anio}</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Docentes</h3>
                                        {docentes.length === 0 ? (
                                            <p>No hay docentes asignados.</p>
                                        ) : (
                                            <table className="w-full border-collapse border border-gray-300 text-sm">
                                                <thead>
                                                    <tr className="bg-gray-100">
                                                        <th className="border px-2 py-1">Nombre</th>
                                                        <th className="border px-2 py-1">Apellido</th>
                                                        <th className="border px-2 py-1">Cargo</th>
                                                        <th className="border px-2 py-1">Año Inicio</th>
                                                        <th className="border px-2 py-1">Año Fin</th>
                                                        <th className="border px-2 py-1">Horas Aula</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {docentes.map((docente) => (
                                                        <tr key={docente.id}>
                                                            <td className="border px-2 py-1">{docente.nombre}</td>
                                                            <td className="border px-2 py-1">{docente.apellido}</td>
                                                            <td className="border px-2 py-1">{docente.cargo}</td>
                                                            <td className="border px-2 py-1">{docente.ano_inicio}</td>
                                                            <td className="border px-2 py-1">{docente.año_fin}</td>
                                                            <td className="border px-2 py-1">{docente.horas_frente_aula}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                <div className="mb-4">
                                    <Link
                                     href={route('dictas.create', { comision_id: comision.id })}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold transition"
                                    >
                                    Agregar Docente
                                    </Link>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
