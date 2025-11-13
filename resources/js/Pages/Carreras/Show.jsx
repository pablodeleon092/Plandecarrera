// resources/js/Pages/Carreras/Show.jsx

import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton'; // Para el botón de Eliminar
import { router } from '@inertiajs/react'; // Para eliminar

export default function Show({ auth, carrera }) {

    // Función para manejar la eliminación
    const handleDelete = () => {
        if (confirm('¿Estás seguro de que quieres eliminar esta carrera? Esta acción no se puede deshacer.')) {
            router.delete(route('carreras.destroy', carrera.id), {
                onSuccess: () => {
                    // Redirigir al índice después de eliminar
                    router.visit(route('carreras.index'));
                },
                onError: (errors) => {
                    alert('Hubo un error al eliminar la carrera: ' + (errors.message || 'Error desconocido'));
                }
            });
        }
    };

    // Helper para formatear la fecha si existe (necesitarías el campo created_at en tu modelo)
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detalle de Carrera</h2>}
        >
            <Head title={carrera.nombre} />

            <div className="py-8">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-center mb-6">
                        <Link href={route('carreras.index')} className="text-blue-600 hover:text-blue-800 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                            Volver a Carreras
                        </Link>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                    {carrera.nombre}
                                    {/* Aquí podríamos poner un "badge" de estado si tuvieras un campo `estado` en Carrera */}
                                    {/* <span className="ml-3 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                        Activo
                                    </span> */}
                                </h1>
                                <p className="text-gray-500 mt-1">
                                    Código: {carrera.codigo} {/* | Creado: {formatDate(carrera.created_at)} */}
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <PrimaryButton as="a" href={route('carreras.edit', carrera.id)}>
                                    Editar Plan de Estudio
                                </PrimaryButton>
                                {/* Botón de Eliminar (requiere el método destroy en el controller) */}
                                <DangerButton onClick={handleDelete}>
                                    Eliminar
                                </DangerButton>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            {/* Información General */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h3 className="text-md font-semibold text-gray-700 mb-3">INFORMACIÓN GENERAL</h3>
                                <p className="text-gray-700"><strong>Código:</strong> {carrera.codigo}</p>
                                {/* <p className="text-gray-700"><strong>Estado:</strong> Activo </p> */}
                                <p className="text-gray-700"><strong>Instituto:</strong> {carrera.instituto ? carrera.instituto.siglas : 'N/A'}</p>
                                <p className="text-gray-700"><strong>Fecha de creación:</strong> {formatDate(carrera.created_at)}</p>
                            </div>

                            {/* Detalles de la Carrera */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h3 className="text-md font-semibold text-gray-700 mb-3">DETALLES DE CARRERA</h3>
                                <p className="text-gray-700"><strong>Duración:</strong> {carrera.duracion_anios} años</p>
                                <p className="text-gray-700"><strong>Título que otorga:</strong> {carrera.titulo_que_otorga}</p>
                            </div>
                        </div>

                        {/* Aquí podrías agregar más secciones, como "Plan de Estudios" si ya tuvieras esa lógica montada */}
                        {/* Ejemplo: */}
                        {/* <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h3 className="text-md font-semibold text-gray-700 mb-3">PLAN DE ESTUDIOS</h3>
                            <p className="text-gray-700">Aquí iría la lista de materias del plan de estudio de esta carrera.</p>
                        </div> */}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}