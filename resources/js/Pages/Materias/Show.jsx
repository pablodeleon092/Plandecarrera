import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, materia }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Materia: {materia.nombre}</h2>}
        >
            <Head title={`Materia: ${materia.nombre}`} />
            
            <div className="bg-gray-50 py-8">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="mb-6">
                        <Link 
                            href={route('materias.index')} 
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-2 transition"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Volver a Materias
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-3xl font-bold text-white">{materia.nombre}</h1>
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                            materia.estado 
                                                ? 'bg-green-400 text-green-900' 
                                                : 'bg-red-400 text-red-900'
                                        }`}>
                                            {materia.estado_nombre}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-blue-100">
                                        <span className="flex items-center gap-2">
                                            {/* Icono de Código */}
                                            Código: {materia.codigo}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            {/* Icono de Calendario */}
                                            {materia.created_at}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Link
                                        href={route('materias.edit', materia.id)} 
                                        className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition flex items-center gap-2 font-semibold"
                                    >
                                        {/* Icono de Editar */}
                                        Editar
                                    </Link>
                                    <Link
                                        href={route('materias.destroy', materia.id)} 
                                        method="delete"
                                        as="button"
                                        onBefore={() => confirm('¿Estás seguro de que deseas eliminar esta materia?')}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2 font-semibold"
                                    >
                                        {/* Icono de Eliminar */}
                                        Eliminar
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* El resto del cuerpo del componente es idéntico, ya que estaba bien diseñado */}
                        <div className="p-8">
                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                                {/* Columna Izquierda */}
                                <div className="space-y-6">
                                    {/* ... Tarjeta de Régimen Académico ... */}
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Régimen Académico</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Tipo de régimen:</span>
                                                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                                                    {materia.regimen_nombre}
                                                </span>
                                            </div>
                                            {materia.cuatrimestre && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">Cuatrimestre:</span>
                                                    <span className="text-lg font-bold text-gray-900">{materia.cuatrimestre}°</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* ... Tarjeta de Carga Horaria ... */}
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border-2 border-blue-200">
                                        <h3 className="text-sm font-semibold text-blue-700 uppercase mb-3">Carga Horaria</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm text-blue-600 mb-1">Horas Semanales</p>
                                                <p className="text-3xl font-bold text-blue-900">{materia.horas_semanales} hs</p>
                                            </div>
                                            <div className="border-t border-blue-200 pt-4">
                                                <p className="text-sm text-blue-600 mb-1">Horas Totales</p>
                                                <p className="text-2xl font-bold text-blue-900">{materia.horas_totales} hs</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Columna Derecha */}
                                <div className="space-y-6">
                                    {/* ... Tarjeta de Información General ... */}
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
                                                    {materia.estado_nombre}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-start py-2">
                                                <span className="text-gray-600 font-medium">Fecha de creación:</span>
                                                <span className="text-gray-900">{materia.created_at}</span>
                                            </div>
                                        </div>
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