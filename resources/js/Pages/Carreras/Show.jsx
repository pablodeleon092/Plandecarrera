// resources/js/Pages/Carreras/Show.jsx

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';

// Partials
import CarreraInfo from './Partials/CarreraInfo';
import CarreraMaterias from './Partials/CarreraMaterias';

export default function Show({ auth, carrera, materias}) {
    const [tab, setTab] = useState('info');

    const handleDelete = () => {
        if (confirm('¿Estás seguro de que quieres eliminar esta carrera? Esta acción es irreversible.')) {
            router.delete(route('carreras.destroy', carrera.id), {
                onSuccess: () => router.visit(route('carreras.index')),
                onError: () => alert('Hubo un error al eliminar la carrera.')
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{carrera.nombre}</h2>}
        >
            <Head title={carrera.nombre} />

            <div className="py-10">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">

                    {/* Botón Volver */}
                    <div className="mb-4">
                        <Link
                            href={route('carreras.index')}
                            className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                            </svg>
                            Volver a Carreras
                        </Link>
                    </div>

                    {/* Tarjeta Principal */}
                    <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{carrera.nombre}</h1>
                            </div>

                            <div className="flex space-x-3">
                                <Link href={route('carreras.edit', carrera.id)}>
                                    <PrimaryButton>
                                        Editar Plan de Estudio
                                    </PrimaryButton>
                                </Link>
                                <DangerButton onClick={handleDelete}>
                                    Eliminar
                                </DangerButton>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="mt-8 border-b border-gray-300">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                className={`pb-2 ${
                                    tab === 'info'
                                        ? 'border-b-2 border-blue-600 text-blue-600 font-semibold'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                                onClick={() => setTab('info')}
                            >
                                Información
                            </button>

                            <button
                                className={`pb-2 ${
                                    tab === 'plan'
                                        ? 'border-b-2 border-blue-600 text-blue-600 font-semibold'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                                onClick={() => setTab('plan')}
                            >
                                Plan de Estudio
                            </button>
                        </nav>
                    </div>

                    {/* Contenido de tabs: usamos los partials */}
                    <div className="mt-6">
                        {tab === 'info' && (
                            <div className="bg-gray-50 p-4 rounded-lg border">
                                <CarreraInfo carrera={carrera}/>
                            </div>
                        )}

                        {tab === 'plan' && (
                            <div className="bg-gray-50 p-4 rounded-lg border">
                                <CarreraMaterias carrera={carrera} materias={materias} />
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
