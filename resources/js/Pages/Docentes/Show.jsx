import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Show({ auth, docente }) {
    const handleDelete = () => {
        if (confirm(`¿Estás seguro de que quieres eliminar al docente ${docente.nombre} ${docente.apellido}?`)) {
            router.delete(route('docentes.destroy', docente.id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Docente: {docente.nombre} {docente.apellido}</h2>}
        >
            <Head title={`Docente: ${docente.nombre} ${docente.apellido}`} />
            
            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <Link 
                            href={route('docentes.index')} 
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-2 transition"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Volver al Listado
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-3xl font-bold text-white">{docente.apellido}, {docente.nombre}</h1>
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                            docente.es_activo 
                                                ? 'bg-green-400 text-green-900' 
                                                : 'bg-red-400 text-red-900'
                                        }`}>
                                            {docente.es_activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-blue-100">
                                        <span className="flex items-center gap-2">Legajo: {docente.legajo}</span>
                                        <span className="flex items-center gap-2">Creado: {new Date(docente.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Link
                                        href={route('docentes.edit', docente.id)} 
                                        className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition font-semibold"
                                    >
                                        Editar
                                    </Link>
                                    <button
                                        onClick={handleDelete}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                                {/* Columna Izquierda: Información Principal */}
                                <div className="space-y-6">
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Información Principal</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Modalidad:</span>
                                                <span className="font-semibold text-gray-900">{docente.modalidad_desempeño}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Carga Horaria:</span>
                                                <span className="font-semibold text-gray-900">{docente.carga_horaria} hs</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Contacto</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Email:</span>
                                                <span className="font-semibold text-gray-900">{docente.email || 'No especificado'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Teléfono:</span>
                                                <span className="font-semibold text-gray-900">{docente.telefono || 'No especificado'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Columna Derecha: Cargos */}
                                <div className="space-y-6">
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Cargos Asignados</h3>
                                        {docente.cargos && docente.cargos.length > 0 ? (
                                            <ul className="space-y-2">
                                                {docente.cargos.map(cargo => (
                                                    <li key={cargo.id} className="p-3 bg-white border rounded-md">
                                                        <p className="font-semibold">{cargo.nombre}</p>
                                                        <p className="text-sm text-gray-500">Dedicación: {cargo.dedicacion.nombre}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="text-center py-4">
                                                <p className="text-gray-500">Este docente no tiene cargos asignados.</p>
                                                <Link
                                                    href={route('docentes.edit', docente.id)}
                                                    className="mt-2 inline-block text-sm text-indigo-600 hover:underline"
                                                >
                                                    Asignar un cargo
                                                </Link>
                                            </div>
                                        )}
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