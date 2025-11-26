import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';

// Componente de Información
function MateriaInfo({ materia }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Régimen Académico */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Régimen Académico
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Tipo de régimen:</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            {materia.regimen}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Cuatrimestre:</span>
                        <span className="text-gray-900 font-semibold text-lg">{materia.cuatrimestre}°</span>
                    </div>
                </div>
            </div>

            {/* Información General */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Información General
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Código:</span>
                        <span className="text-gray-900 font-semibold">{materia.codigo}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Estado:</span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            {materia.estado}
                        </span>
                    </div>
                </div>
            </div>

            {/* Carga Horaria */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-6 md:col-span-2 hover:shadow-md transition-shadow">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-6">
                    Carga Horaria
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center bg-white rounded-lg p-6 shadow-sm">
                        <p className="text-sm text-gray-500 mb-2">Horas Semanales</p>
                        <p className="text-4xl font-bold text-blue-600">{materia.horas_semanales}</p>
                        <p className="text-xs text-gray-400 mt-1">hs</p>
                    </div>
                    <div className="text-center bg-white rounded-lg p-6 shadow-sm">
                        <p className="text-sm text-gray-500 mb-2">Horas Totales</p>
                        <p className="text-4xl font-bold text-indigo-600">{materia.horas_totales}</p>
                        <p className="text-xs text-gray-400 mt-1">hs</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Componente de Comisiones
function MateriaComisiones({ comisiones, materia }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                    Comisiones Asignadas
                </h3>
                <Link
                    href={route('comisiones.create', { materia_id: materia.id })}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    + Nueva Comisión
                </Link>
            </div>
            
            {comisiones && comisiones.length > 0 ? (
                <div className="grid gap-4">
                    {comisiones.map((comision) => (
                        <div 
                            key={comision.id}
                            className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-all hover:border-blue-300"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                        {comision.nombre}
                                    </h4>
                                    <div className="flex gap-4 text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {comision.turno}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            {comision.docentes_count || 0} docentes
                                        </span>
                                    </div>
                                </div>
                                <Link
                                    href={route('comisiones.show', comision.id)}
                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                >
                                    Ver detalles →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500">No hay comisiones asignadas</p>
                </div>
            )}
        </div>
    );
}

// Componente Principalini
export default function Show({ auth, materia, comisiones }) {
    const [currentTab, setCurrentTab] = useState('informacion');

    const handleDelete = () => {
        if (confirm('¿Estás seguro de que deseas eliminar esta materia?')) {
            router.delete(route('materias.destroy', materia.id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Materia: {materia.nombre}</h2>}
        >
            <Head title={`Materia: ${materia.nombre}`} />

            <div className="min-h-screen bg-gray-50">
                {/* Header mejorado */}
                <div className="bg-white border-b border-gray-200">
                    <div className="container mx-auto px-4 max-w-5xl py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                    <Link 
                                        href={route('materias.index')} 
                                        className="hover:text-blue-600 transition-colors"
                                    >
                                        Materias
                                    </Link>
                                    <span>/</span>
                                    <span className="text-gray-700">{materia.nombre}</span>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {materia.nombre}
                                </h1>
                            </div>
                            <div className="flex gap-3">
                                <Link
                                    href={route('materias.edit', materia.id)}
                                    className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                                >
                                    Editar
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contenido principal */}
                <div className="container mx-auto px-4 max-w-5xl py-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* Tabs mejorados */}
                        <div className="border-b border-gray-200 bg-gray-50">
                            <div className="flex">
                                <button
                                    onClick={() => setCurrentTab('informacion')}
                                    className={`relative px-6 py-4 font-medium transition-all ${
                                        currentTab === 'informacion'
                                            ? 'text-blue-600 bg-white'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    Información
                                    {currentTab === 'informacion' && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                                    )}
                                </button>
                                <button
                                    onClick={() => setCurrentTab('comisiones')}
                                    className={`relative px-6 py-4 font-medium transition-all ${
                                        currentTab === 'comisiones'
                                            ? 'text-blue-600 bg-white'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    Comisiones
                                    {currentTab === 'comisiones' && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Contenido dinámico */}
                        <div className="p-8">
                            {currentTab === 'informacion' ? (
                                <MateriaInfo materia={materia} />
                            ) : (
                                <MateriaComisiones comisiones={comisiones} materia={materia} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}